import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import crypto from "crypto"
import { ApiKey } from "../models.js"

const createKeySchema = z.object({
  name: z.string().min(1, "API Key label is required.").max(100).trim(),
})

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET /api/v1/api-keys
//    Fetch all active API keys for the current user session
// ─────────────────────────────────────────────────────────────────────────────
export async function getApiKeysController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Active session required to fetch keys.",
      })
      return
    }

    const keys = await ApiKey.find({ ownerId: userId }).sort({ createdAt: -1 })

    const formattedKeys = keys.map((key) => ({
      id: key._id.toString(),
      name: key.name,
      maskedKey: key.maskedKey,
      createdAt: key.createdAt.toISOString().split("T")[0],
      lastUsed: key.lastUsed
        ? key.lastUsed.toISOString().replace("T", " ").substring(0, 16)
        : "Never",
      isRevoked: false,
    }))

    res.status(200).json({
      success: true,
      keys: formattedKeys,
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. POST /api/v1/api-keys
//    Generate a secure random key, hash it (SHA-256), store it, and return plain text
// ─────────────────────────────────────────────────────────────────────────────
export async function createApiKeyController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Active session required to generate keys.",
      })
      return
    }

    const parseResult = createKeySchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Validation Failure",
        details: parseResult.error.flatten().fieldErrors,
      })
      return
    }

    const { name } = parseResult.data

    // Generate secure simulated plaintext API key string
    const hexToken = crypto.randomBytes(16).toString("hex")
    const plaintextKey = `sk_sansrut_${hexToken}`

    // Hash it using SHA-256 for secure database lookup
    const hashedKey = crypto
      .createHash("sha256")
      .update(plaintextKey)
      .digest("hex")

    // Create the masked representation for dashboard listing
    const maskedKey = `sk_sansrut_••••${plaintextKey.slice(-4)}`

    const newKey = await ApiKey.create({
      name,
      hashedKey,
      maskedKey,
      ownerId: userId,
    })

    const formattedKey = {
      id: newKey._id.toString(),
      name: newKey.name,
      maskedKey: newKey.maskedKey,
      createdAt: newKey.createdAt.toISOString().split("T")[0],
      lastUsed: "Never",
      isRevoked: false,
    }

    res.status(201).json({
      success: true,
      message: "API Key created successfully.",
      key: formattedKey,
      plaintextKey, // Returned exactly once to be copied by the client
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DELETE /api/v1/api-keys/:id
//    Revoke and remove a developer API key
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteApiKeyController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id
    const keyId = req.params.id

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Active session required to revoke keys.",
      })
      return
    }

    const result = await ApiKey.findOneAndDelete({ _id: keyId, ownerId: userId })

    if (!result) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "API key was not found or you are not authorized to revoke it.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "API key successfully revoked.",
    })
  } catch (error) {
    next(error)
  }
}
