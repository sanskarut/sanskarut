"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import {
  LayoutTemplate,
  KeyRound,
  History,
  TrendingUp,
  Mail,
  BarChart3,
  Zap,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  name: string
  email: string
  plan: "FREE" | "PRO"
  apiCallCount: number
  apiCallLimit: number
  apiCallResetAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

// ─── Quick Action Cards ───────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    href: "/dashboard/templates",
    icon: LayoutTemplate,
    label: "Browse Templates",
    desc: "View, edit and preview email designs",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700",
  },
  {
    href: "/dashboard/api-keys",
    icon: KeyRound,
    label: "API Keys",
    desc: "Manage your Mail Gateway tokens",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900/30 hover:border-violet-300 dark:hover:border-violet-700",
  },
  {
    href: "/dashboard/logs",
    icon: History,
    label: "Email Logs",
    desc: "Inspect delivery history",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700",
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [keysCount, setKeysCount] = useState(0)
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("sansrut_token")
        if (!token) return

        const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"

        // 1. Fetch live user details from backend to sync counts
        const meRes = await fetch(`${API_URL}/api/v1/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const meData = await meRes.json()
        if (meData.success && meData.user) {
          setUser({
            name: meData.user.name || "User",
            email: meData.user.email || "",
            plan: meData.user.plan || "FREE",
            apiCallCount: meData.user.apiCallCount ?? 0,
            apiCallLimit: meData.user.apiCallLimit ?? 1000,
            apiCallResetAt: meData.user.apiCallResetAt || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
          })
          localStorage.setItem("sansrut_user", JSON.stringify(meData.user))
        }

        // 2. Fetch real active keys count
        const keysRes = await fetch(`${API_URL}/api/v1/api-keys`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const keysData = await keysRes.json()
        if (keysData.success) {
          setKeysCount(keysData.keys.length)
        }

        // 3. Fetch real email gateway recent activity logs
        const logsRes = await fetch(`${API_URL}/api/v1/emails/logs`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const logsData = await logsRes.json()
        if (logsData.success) {
          setRecentLogs(logsData.logs.slice(0, 4))
        }
      } catch (err) {
        console.error("Dashboard data fetching failed:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const usedPct = user ? Math.min((user.apiCallCount / user.apiCallLimit) * 100, 100) : 53
  const remaining = user ? Math.max(user.apiCallLimit - user.apiCallCount, 0) : 470
  const progressColor = usedPct >= 90 ? "bg-red-500" : usedPct >= 70 ? "bg-amber-500" : "bg-blue-500"

  const greeting = (() => {
    const h = currentTime.getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  })()

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b192c] via-[#0f2744] to-[#1a3a6b] p-7 text-white shadow-xl">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/10 rounded-full" />
          <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/5 to-transparent" />

          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-300/80 text-sm font-semibold mb-1">
                  {greeting},
                </p>
                <h1 className="text-3xl font-black tracking-tight">
                  {user?.name.split(" ")[0] ?? "Developer"} 👋
                </h1>
                <p className="text-slate-400 text-sm mt-2 max-w-md">
                  Welcome back to your Sansrut Mail Engine dashboard. Here&apos;s a snapshot of your account.
                </p>
              </div>

              {/* Plan badge */}
              <div className="hidden sm:flex flex-col items-end gap-2">
                <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${
                  user?.plan === "PRO"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                }`}>
                  {user?.plan ?? "FREE"} PLAN
                </span>
                <p className="text-[11px] text-slate-500">{user?.email}</p>
              </div>
            </div>

            {/* API Usage mini-bar */}
            <div className="mt-6 max-w-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400">API Usage this month</span>
                <span className="text-xs font-bold text-blue-300">
                  {(user?.apiCallCount ?? 530).toLocaleString()} / {(user?.apiCallLimit ?? 1000).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${progressColor}`}
                  style={{ width: `${usedPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{remaining.toLocaleString()} calls remaining · Resets {user?.apiCallResetAt ? formatDate(user.apiCallResetAt) : "next month"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Cards ─────────────────────────────────────────────────────── */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "API Calls Made", value: (user?.apiCallCount ?? 0).toLocaleString(), icon: TrendingUp, change: "+12%", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
          { label: "Calls Remaining", value: remaining.toLocaleString(), icon: Zap, change: "", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
          { label: "Plan Limit", value: (user?.apiCallLimit ?? 1000).toLocaleString(), icon: ShieldCheck, change: "", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/20" },
          { label: "Active Keys", value: keysCount.toString(), icon: KeyRound, change: "Live Tokens", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/20" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl">
              <CardContent className="p-5">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-black text-[#0b192c] dark:text-white">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{stat.label}</p>
                {stat.change && (
                  <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* ── Quick Actions ────────────────────────────────────────────────────── */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-[#0b192c] dark:text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Card className={`group border bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl cursor-pointer transition-all hover:shadow-md ${action.border}`}>
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 bg-opacity-10`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-extrabold text-sm text-[#0b192c] dark:text-white">{action.label}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{action.desc}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* ── Upgrade CTA (FREE only) ────────────────────────────────────────── */}
      {(!user || user.plan === "FREE") && (
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span className="text-xs font-black uppercase tracking-widest text-amber-300">PRO PLAN</span>
                </div>
                <h3 className="text-xl font-black mb-1">Unlock 50,000 API calls/month</h3>
                <p className="text-blue-100/80 text-sm max-w-md">
                  Get 50× more capacity, priority SMTP delivery, advanced analytics, and dedicated support.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {["50,000 API calls", "Priority SMTP", "Advanced Analytics", "Team Seats"].map((f) => (
                    <span key={f} className="text-[11px] font-bold bg-white/15 px-2.5 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
              <button className="flex-shrink-0 flex items-center gap-2 bg-white text-blue-700 font-black px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg">
                Upgrade Now
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Alert: Near Limit ─────────────────────────────────────────────── */}
      {usedPct >= 70 && usedPct < 90 && (
        <motion.div variants={item}>
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Approaching your plan limit</p>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-0.5">
                You&apos;ve used {usedPct.toFixed(0)}% of your monthly API quota. Consider upgrading to PRO for 50× more capacity.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Recent Activity Placeholder ───────────────────────────────────── */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-[#0b192c] dark:text-white">Recent Activity</h2>
          <Link href="/dashboard/logs" className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1">
            View all logs
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl overflow-hidden">
          {recentLogs.map((log, i) => (
            <div key={log.id || i} className={`flex items-start gap-3 px-5 py-4 ${i < recentLogs.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>
              <span className="text-lg flex-shrink-0 mt-0.5">{log.status === "Delivered" ? "✅" : "❌"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0b192c] dark:text-slate-200 truncate">{log.subject}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">To: {log.recipient}</p>
              </div>
              <p className="text-[10px] font-bold text-slate-400 flex-shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {log.timestamp.split(" ")[1]}
              </p>
            </div>
          ))}
          {recentLogs.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-400 font-medium">
              No recent email gateway activity found.
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── System Status ─────────────────────────────────────────────────── */}
      <motion.div variants={item}>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <h3 className="font-black text-[#0b192c] dark:text-white text-sm mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              System Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Mail Gateway", status: "Operational", ok: true },
                { label: "MongoDB", status: "Connected", ok: true },
                { label: "Auth Service", status: "Operational", ok: true },
                { label: "SMTP Service", status: "Operational", ok: true },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className={`text-xs font-black mb-1 ${s.ok ? "text-emerald-600" : "text-red-600"}`}>{s.status}</div>
                  <div className="text-[10px] font-semibold text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
