import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models.js"

const JWT_SECRET = process.env.JWT_SECRET || "sansrut-core-security-secret-key-321"
const JWT_EXPIRES_IN = "24h"

// ─── Zod Validation Schemas ───────────────────────────────────────────────────

const checkEmailSchema = z.object({
  email: z
    .string()
    .email("A valid email address is required.")
    .toLowerCase()
    .trim(),
})

const loginSchema = z.object({
  email: z
    .string()
    .email("A valid email address is required.")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required."),
})

const signupSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters.").trim(),
  email: z
    .string()
    .email("A valid email address is required.")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must not exceed 128 characters."),
})

// ─── Helper: Build safe user payload (strips password) ────────────────────────

function buildUserPayload(user: any) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    plan: user.plan,
    apiCallCount: user.apiCallCount,
    apiCallLimit: user.apiCallLimit,
    apiCallResetAt: user.apiCallResetAt,
    createdAt: user.createdAt,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. POST /api/v1/auth/check-email
//    Google-style Step 1: determines if this is a login or signup flow
// ─────────────────────────────────────────────────────────────────────────────

export async function checkEmailController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parseResult = checkEmailSchema.safeParse(req.body)

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Validation Failure",
        details: parseResult.error.flatten().fieldErrors,
      })
      return
    }

    const { email } = parseResult.data

    // Only check existence — never reveal password hash or any user details
    const existingUser = await User.findOne({ email }).select("_id").lean()

    res.status(200).json({
      success: true,
      exists: !!existingUser,
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. POST /api/v1/auth/login
//    Validates bcrypt password, returns signed JWT
// ─────────────────────────────────────────────────────────────────────────────

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parseResult = loginSchema.safeParse(req.body)

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Validation Failure",
        details: parseResult.error.flatten().fieldErrors,
      })
      return
    }

    const { email, password } = parseResult.data

    // Fetch user including password hash for bcrypt comparison
    const user = await User.findOne({ email }).select("+password")

    // Use generic error to prevent email enumeration attacks
    if (!user) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid email or password. Please try again.",
      })
      return
    }

    // Constant-time bcrypt comparison
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid email or password. Please try again.",
      })
      return
    }

    // Sign JWT with user identity and plan tier
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        plan: user.plan,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(200).json({
      success: true,
      message: "Authentication successful.",
      token,
      user: buildUserPayload(user),
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. POST /api/v1/auth/signup
//    Creates new FREE plan user, returns signed JWT
// ─────────────────────────────────────────────────────────────────────────────

export async function signupController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parseResult = signupSchema.safeParse(req.body)

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Validation Failure",
        details: parseResult.error.flatten().fieldErrors,
      })
      return
    }

    const { name, email, password } = parseResult.data

    // Check for pre-existing account before hashing (saves CPU cycles)
    const existingUser = await User.findOne({ email }).select("_id").lean()

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: "Conflict",
        message: "An account with this email address already exists.",
      })
      return
    }

    // Hash password with cost factor 12 (production-grade)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Compute next monthly reset timestamp
    const now = new Date()
    const apiCallResetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // Create user with FREE plan defaults
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      plan: "FREE",
      apiCallLimit: 1000,
      apiCallCount: 0,
      apiCallResetAt,
    })

    // Sign JWT immediately — no separate login step required
    const token = jwt.sign(
      {
        id: newUser._id.toString(),
        email: newUser.email,
        plan: newUser.plan,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
      success: true,
      message: "Account created successfully. Welcome aboard!",
      token,
      user: buildUserPayload(newUser),
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GET /api/v1/auth/me
//    Returns current authenticated user's profile + usage stats (JWT protected)
// ─────────────────────────────────────────────────────────────────────────────

export async function getMeController(
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
        message: "No active session detected.",
      })
      return
    }

    const user = await User.findById(userId)
      .select("-password")
      .lean()

    if (!user) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "User profile could not be located.",
      })
      return
    }

    // Check if monthly reset is due and perform it transparently
    const now = new Date()
    if (now >= new Date(user.apiCallResetAt)) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            apiCallCount: 0,
            apiCallResetAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
          },
        },
        { new: true }
      )
        .select("-password")
        .lean()

      res.status(200).json({
        success: true,
        user: buildUserPayload(updatedUser),
      })
      return
    }

    res.status(200).json({
      success: true,
      user: buildUserPayload(user),
    })
  } catch (error) {
    next(error)
  }
}
