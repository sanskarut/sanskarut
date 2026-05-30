"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ShieldCheck, Eye, EyeOff, Lock, Mail, AlertCircle, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TeamLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"

      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password credentials.")
        setIsLoading(false)
        return
      }

      // Store JWT session token in localStorage
      localStorage.setItem("sansrut_token", data.token)
      localStorage.setItem("sansrut_user", JSON.stringify(data.user))

      // Redirect to dashboard overview
      router.push("/dashboard")
    } catch {
      setError("Unable to reach the authentication server. Check your connection.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b192c] relative overflow-hidden">
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md px-4 z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
              <Terminal className="w-7 h-7 text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            sansrut<span className="text-blue-500">.</span>
          </h1>
          <p className="text-slate-400 text-sm font-semibold mt-1.5 tracking-wide uppercase text-[10px]">
            Internal Mail Engine — Team Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Restricted Access
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-1">
                Authorized team members only. Credentials are verified against the internal registry.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl p-4 flex items-start gap-3 text-sm font-semibold"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400"
                >
                  Team Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin@sanskarut.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 h-auto bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
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
                    Authenticating…
                  </span>
                ) : (
                  "Authenticate & Enter Dashboard"
                )}
              </Button>
            </form>

            {/* Security Note */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex items-start gap-2.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
              <span>
                Access is restricted to verified Sansrut team members. All sessions are signed with HS256 JWT tokens valid for 24 hours.
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
