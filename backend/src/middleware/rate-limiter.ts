import { Request, Response, NextFunction } from "express"
import { User } from "../models.js"

// ─────────────────────────────────────────────────────────────────────────────
// checkRateLimit Middleware
//
// Sits between authorizeApiKey and the email send controller.
// Enforces per-user plan API call quotas tracked directly in MongoDB.
//
// Algorithm:
//  1. Read ownerId from req.user.id (populated by authorizeApiKey)
//  2. Fetch user from MongoDB for fresh count (avoids stale cached values)
//  3. If monthly reset date has passed → atomically reset apiCallCount to 0
//  4. If apiCallCount >= apiCallLimit → return 429 Too Many Requests
//  5. Else → atomically $inc apiCallCount by 1 and allow the request
// ─────────────────────────────────────────────────────────────────────────────

export async function checkRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id

    if (!userId) {
      // Should never reach here since authorizeApiKey runs first
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User context not available for rate limit check.",
      })
      return
    }

    // Fetch fresh user document from MongoDB (not cached values from JWT)
    const user = await User.findById(userId).select(
      "plan apiCallCount apiCallLimit apiCallResetAt"
    )

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User account associated with this API key was not found.",
      })
      return
    }

    const now = new Date()

    // ── Monthly reset check ─────────────────────────────────────────────────
    // If the reset timestamp has passed, atomically reset the counter and
    // advance the resetAt date forward by one month before continuing.
    if (now >= user.apiCallResetAt) {
      const nextResetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1)

      await User.updateOne(
        { _id: userId },
        {
          $set: {
            apiCallCount: 0,
            apiCallResetAt: nextResetAt,
          },
        }
      )

      // Update local reference so the limit check below uses the reset count
      user.apiCallCount = 0
      user.apiCallResetAt = nextResetAt

      console.log(
        `[Rate Limiter] Monthly reset applied for user ${userId}. ` +
          `Next reset: ${nextResetAt.toISOString()}`
      )
    }

    // ── Quota enforcement ───────────────────────────────────────────────────
    if (user.apiCallCount >= user.apiCallLimit) {
      const planLabel = user.plan === "PRO" ? "PRO" : "FREE"
      const resetDate = user.apiCallResetAt.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })

      res.status(429).json({
        success: false,
        error: "Rate Limit Exceeded",
        message:
          `You have used ${user.apiCallCount}/${user.apiCallLimit} API calls on your ${planLabel} plan. ` +
          `Your quota resets on ${resetDate}.`,
        details: {
          plan: planLabel,
          apiCallCount: user.apiCallCount,
          apiCallLimit: user.apiCallLimit,
          resetAt: user.apiCallResetAt.toISOString(),
          upgradeUrl: "https://sanskarut.com/upgrade",
        },
      })
      return
    }

    // ── Atomic increment ────────────────────────────────────────────────────
    // Use $inc so concurrent requests can't bypass the limit through race conditions.
    await User.updateOne({ _id: userId }, { $inc: { apiCallCount: 1 } })

    // Refresh req.user with updated count for downstream logging
    req.user = {
      id: userId,
      plan: user.plan,
      apiCallCount: user.apiCallCount + 1,
      apiCallLimit: user.apiCallLimit,
    }

    console.log(
      `[Rate Limiter] User ${userId} (${user.plan}): ` +
        `${user.apiCallCount + 1}/${user.apiCallLimit} calls consumed.`
    )

    next()
  } catch (error) {
    next(error)
  }
}
