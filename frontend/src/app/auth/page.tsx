"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthStep = "email" | "login" | "signup"

interface StepConfig {
  title: string
  subtitle: string
}

const stepConfig: Record<AuthStep, StepConfig> = {
  email: {
    title: "Sign in",
    subtitle: "Use your Sansrut account",
  },
  login: {
    title: "Welcome back",
    subtitle: "", // filled dynamically with email
  },
  signup: {
    title: "Create your account",
    subtitle: "Join the Sansrut platform",
  },
}

// ─── Inline Spinner ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ─── Slide Animation Variants ─────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<AuthStep>("email")
  const [direction, setDirection] = useState<number>(1)

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"

  // ── Navigation helpers ─────────────────────────────────────────────────────

  function goBack() {
    setDirection(-1)
    setError(null)
    setPassword("")
    setShowPassword(false)
    setStep("email")
    setTimeout(() => emailRef.current?.focus(), 150)
  }

  function advanceTo(next: AuthStep) {
    setDirection(1)
    setError(null)
    setStep(next)
  }

  // ── Step 1: Check email ────────────────────────────────────────────────────

  async function handleEmailNext(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError("Something went wrong. Please try again.")
        return
      }

      // Route to the correct second step based on account existence
      advanceTo(data.exists ? "login" : "signup")
    } catch {
      setError("Unable to reach the server. Check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 2a: Sign in ───────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!password) return
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Wrong password. Try again.")
        return
      }

      // Persist session
      localStorage.setItem("sansrut_token", data.token)
      localStorage.setItem("sansrut_user", JSON.stringify(data.user))
      router.push("/dashboard/api-keys")
    } catch {
      setError("Unable to reach the server. Check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Step 2b: Sign up ───────────────────────────────────────────────────────

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !password) return
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        // Handle validation errors
        if (data.details) {
          const msgs = Object.values(data.details).flat()
          setError((msgs[0] as string) || "Please fix the errors above.")
        } else {
          setError(data.message || "Account creation failed. Please try again.")
        }
        return
      }

      // Persist session
      localStorage.setItem("sansrut_token", data.token)
      localStorage.setItem("sansrut_user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch {
      setError("Unable to reach the server. Check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2f2f2] px-4">
      {/* Sansrut wordmark */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          {/* Logo mark */}
          <div className="w-9 h-9 rounded-lg bg-[#0b192c] flex items-center justify-center">
            <span className="text-white font-black text-sm tracking-tighter">S</span>
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#0b192c]">
          sansrut<span className="text-blue-600">.</span>
        </h1>
      </motion.div>

      {/* Auth Card */}
      <div
        className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.12)] overflow-hidden"
        style={{ minHeight: "420px" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {/* ═══ STEP 1: EMAIL ════════════════════════════════════════════ */}
          {step === "email" && (
            <motion.div
              key="email-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="p-8"
            >
              <h2 className="text-[26px] font-normal text-[#202124] mb-1">
                {stepConfig.email.title}
              </h2>
              <p className="text-sm text-[#5f6368] mb-7">
                {stepConfig.email.subtitle}
              </p>

              {error && <ErrorBanner message={error} />}

              <form onSubmit={handleEmailNext} className="space-y-5">
                <div className="relative">
                  <input
                    ref={emailRef}
                    id="auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full px-4 pt-5 pb-2 border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/30 transition-all bg-white"
                  />
                  <label
                    htmlFor="auth-email"
                    className="absolute left-4 top-3.5 text-xs font-medium text-[#5f6368] peer-focus:text-[#1a73e8] transition-colors select-none pointer-events-none"
                  >
                    Email address
                  </label>
                  <Mail className="absolute right-3.5 top-4 w-4 h-4 text-[#9aa0a6]" />
                </div>

                <p className="text-[11px] text-[#5f6368] leading-relaxed">
                  Not your device?{" "}
                  <span className="text-[#1a73e8] cursor-pointer hover:underline">
                    Use a private window to sign in.
                  </span>
                </p>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-[#1a73e8] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    Create account
                  </button>
                  <Button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded-lg px-6 py-2 text-sm h-auto cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    {isLoading ? <Spinner /> : null}
                    Next
                    {!isLoading && <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ═══ STEP 2A: LOGIN ═══════════════════════════════════════════ */}
          {step === "login" && (
            <motion.div
              key="login-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="p-8"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-[#5f6368] hover:text-[#202124] mb-5 -ml-1 group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back
              </button>

              <h2 className="text-[26px] font-normal text-[#202124] mb-0.5">
                {stepConfig.login.title}
              </h2>

              {/* Pill showing selected email */}
              <button
                onClick={goBack}
                className="flex items-center gap-2 bg-[#f1f3f4] hover:bg-[#e8eaed] rounded-full px-3.5 py-1.5 mb-6 mt-2 transition-colors group"
              >
                <div className="w-5 h-5 rounded-full bg-[#0b192c] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-[9px]">
                    {email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#202124]">
                  {email}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#5f6368] ml-0.5 rotate-90" />
              </button>

              {error && <ErrorBanner message={error} />}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    autoFocus
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full px-4 pt-5 pb-2 border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/30 transition-all bg-white pr-10"
                  />
                  <label
                    htmlFor="auth-password"
                    className="absolute left-4 top-3.5 text-xs font-medium text-[#5f6368] peer-focus:text-[#1a73e8] transition-colors select-none pointer-events-none"
                  >
                    Enter your password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#9aa0a6] hover:text-[#5f6368] transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  className="text-sm text-[#1a73e8] hover:underline"
                >
                  Forgot password?
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm font-medium text-[#1a73e8] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    Use another account
                  </button>
                  <Button
                    type="submit"
                    disabled={isLoading || !password}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded-lg px-6 py-2 text-sm h-auto cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    {isLoading ? <Spinner /> : null}
                    Sign in
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ═══ STEP 2B: SIGNUP ══════════════════════════════════════════ */}
          {step === "signup" && (
            <motion.div
              key="signup-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="p-8"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-[#5f6368] hover:text-[#202124] mb-5 -ml-1 group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back
              </button>

              <h2 className="text-[26px] font-normal text-[#202124] mb-0.5">
                {stepConfig.signup.title}
              </h2>
              <p className="text-sm text-[#5f6368] mb-6 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span>{email}</span>
              </p>

              {error && <ErrorBanner message={error} />}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <input
                    id="auth-name"
                    type="text"
                    required
                    autoComplete="name"
                    autoFocus
                    placeholder=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="peer w-full px-4 pt-5 pb-2 border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/30 transition-all bg-white pr-10"
                  />
                  <label
                    htmlFor="auth-name"
                    className="absolute left-4 top-3.5 text-xs font-medium text-[#5f6368] peer-focus:text-[#1a73e8] transition-colors select-none pointer-events-none"
                  >
                    Full name
                  </label>
                  <User className="absolute right-3.5 top-4 w-4 h-4 text-[#9aa0a6]" />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    id="auth-new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full px-4 pt-5 pb-2 border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]/30 transition-all bg-white pr-10"
                  />
                  <label
                    htmlFor="auth-new-password"
                    className="absolute left-4 top-3.5 text-xs font-medium text-[#5f6368] peer-focus:text-[#1a73e8] transition-colors select-none pointer-events-none"
                  >
                    Create a password (min. 8 chars)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#9aa0a6] hover:text-[#5f6368] transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password strength hint */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex gap-1 pt-0.5"
                  >
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= level * 2
                            ? password.length < 6
                              ? "bg-red-400"
                              : password.length < 10
                              ? "bg-amber-400"
                              : "bg-green-500"
                            : "bg-[#e8eaed]"
                        }`}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Plan badge */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-700">
                      FREE Plan — 1,000 API calls/month
                    </p>
                    <p className="text-[10px] text-blue-500 mt-0.5">
                      Upgrade to PRO for 50,000 calls/month anytime.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm font-medium text-[#1a73e8] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    Use existing account
                  </button>
                  <Button
                    type="submit"
                    disabled={isLoading || !name.trim() || password.length < 8}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded-lg px-6 py-2 text-sm h-auto cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    {isLoading ? <Spinner /> : null}
                    Create account
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex items-center gap-6 text-xs text-[#5f6368]"
      >
        {["Help", "Privacy", "Terms"].map((item) => (
          <button
            key={item}
            className="hover:underline"
          >
            {item}
          </button>
        ))}
        <span className="ml-auto text-[#5f6368]">English (US)</span>
      </motion.div>
    </div>
  )
}

// ─── Error Banner Component ────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 bg-red-50 border border-red-200/80 text-red-700 rounded-xl p-3.5 mb-5 text-sm font-medium"
    >
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
      <span>{message}</span>
    </motion.div>
  )
}
