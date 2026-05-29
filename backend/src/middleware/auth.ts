import { Request, Response, NextFunction } from "express"
import crypto from "crypto"
import { ApiKey, User } from "../models.js"

// Extend Express Request to carry authenticated user context
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        plan?: "FREE" | "PRO";
        apiCallCount?: number;
        apiCallLimit?: number;
      };
      apiKeyId?: string;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// authorizeApiKey Middleware
// Validates SHA-256 hashed Bearer token against MongoDB ApiKey collection.
// Populates req.user with the full owner User document's relevant fields.
// ─────────────────────────────────────────────────────────────────────────────

export async function authorizeApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message:
          "Missing or invalid authorization header. Bearer API key required.",
      })
      return
    }

    const rawToken = authHeader.split(" ")[1]

    if (!rawToken || rawToken.trim().length === 0) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "API key token string must be provided.",
      })
      return
    }

    // Compute SHA-256 digest of the raw token for constant-time DB lookup
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    // Fetch the API key document and eagerly populate the owning User
    const apiKeyDoc = await ApiKey.findOne({ hashedKey: tokenHash })
      .populate<{ ownerId: InstanceType<typeof User> }>("ownerId")
      .lean()

    if (!apiKeyDoc) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid API key. Key may be incorrect or has been revoked.",
      })
      return
    }

    const ownerUser = apiKeyDoc.ownerId as any

    if (!ownerUser || !ownerUser._id) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message:
          "Associated user account for this API key could not be verified.",
      })
      return
    }

    // Bind auth context to request scope for downstream middleware
    req.user = {
      id: ownerUser._id.toString(),
      plan: ownerUser.plan,
      apiCallCount: ownerUser.apiCallCount,
      apiCallLimit: ownerUser.apiCallLimit,
    }
    req.apiKeyId = (apiKeyDoc as any)._id.toString()

    // Fire-and-forget: update lastUsed without blocking the request chain
    ApiKey.updateOne(
      { hashedKey: tokenHash },
      { $set: { lastUsed: new Date() } }
    ).catch((err) => {
      console.error("[Auth Middleware] Failed to update lastUsed timestamp:", err)
    })

    next()
  } catch (error) {
    next(error)
  }
}
