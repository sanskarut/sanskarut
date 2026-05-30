"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  KeyRound,
  History,
  Menu,
  LayoutTemplate,
  Mail,
  LogOut,
  ChevronRight,
  Zap,
  Bell,
  Settings,
  BarChart3,
  User,
  X,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  name: string
  email: string
  plan: "FREE" | "PRO"
  apiCallCount: number
  apiCallLimit: number
}

// ─── Nav Groups ───────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/dashboard/logs", icon: BarChart3 },
    ],
  },
  {
    label: "Mail Engine",
    items: [
      { name: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
      { name: "Email Logs", href: "/dashboard/logs", icon: Mail },
    ],
  },
  {
    label: "Developer",
    items: [
      { name: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
      { name: "Send History", href: "/dashboard/logs", icon: History },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getPlanColor(plan: "FREE" | "PRO") {
  return plan === "PRO"
    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
    : "bg-blue-500/20 text-blue-300 border-blue-500/30"
}

// ─── Sidebar Component ────────────────────────────────────────────────────────

function SidebarContent({
  user,
  onLogout,
  onClose,
}: {
  user: UserProfile | null
  onLogout: () => void
  onClose?: () => void
}) {
  const pathname = usePathname()
  const usedPct = user
    ? Math.min((user.apiCallCount / user.apiCallLimit) * 100, 100)
    : 0

  return (
    <div className="flex flex-col h-full bg-[#060e1a] text-slate-400 select-none overflow-y-auto">
      {/* ── Brand Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-white font-black text-base tracking-tight">
              sansrut<span className="text-blue-400">.</span>
            </div>
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest -mt-0.5">
              Mail Engine
            </div>
          </div>
        </Link>
        {/* Close on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Navigation Groups ─────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600 px-3 mb-2">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name + item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 relative ${
                      isActive
                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full" />
                    )}
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive
                          ? "text-blue-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 text-blue-400/50" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Usage Mini-Bar ────────────────────────────────────────────────── */}
      {user && (
        <div className="mx-3 mb-3 bg-white/3 border border-white/5 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              API Usage
            </span>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPlanColor(user.plan)}`}
            >
              {user.plan}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
            <div
              className={`h-full rounded-full transition-all ${
                usedPct >= 90
                  ? "bg-red-500"
                  : usedPct >= 70
                  ? "bg-amber-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-600 font-semibold">
            {user.apiCallCount.toLocaleString()} /{" "}
            {user.apiCallLimit.toLocaleString()} calls
          </p>
          {user.plan === "FREE" && (
            <Link href="/dashboard/upgrade" onClick={onClose}>
              <button className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-bold transition-all">
                <Sparkles className="w-3 h-3" />
                Upgrade to PRO
              </button>
            </Link>
          )}
        </div>
      )}

      {/* ── User Profile & Logout ─────────────────────────────────────────── */}
      <div className="border-t border-white/5 p-3">
        {user ? (
          <div className="group relative">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-all cursor-default">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                <span className="text-white font-black text-xs">
                  {getInitials(user.name)}
                </span>
              </div>
              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-slate-500 text-[10px] font-medium truncate">
                  {user.email}
                </p>
              </div>
              {/* Plan badge */}
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ${getPlanColor(user.plan)}`}
              >
                {user.plan}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="mt-1.5 w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/8 transition-all text-sm font-semibold group/logout"
            >
              <LogOut className="w-4 h-4 group-hover/logout:scale-105 transition-transform" />
              <span>Sign out</span>
            </button>
          </div>
        ) : (
          <Link href="/auth" onClick={onClose}>
            <button className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Validate session token with the backend and pull current user usage statistics
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem("sansrut_token")
        if (!token) {
          router.push("/auth")
          return
        }

        const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
        const res = await fetch(`${API_URL}/api/v1/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!res.ok) {
          // Token is expired, invalid, or revoked
          localStorage.removeItem("sansrut_token")
          localStorage.removeItem("sansrut_user")
          router.push("/auth")
          return
        }

        const data = await res.json()
        if (data.success && data.user) {
          setUser({
            name: data.user.name || "User",
            email: data.user.email || "",
            plan: data.user.plan || "FREE",
            apiCallCount: data.user.apiCallCount ?? 0,
            apiCallLimit: data.user.apiCallLimit ?? 1000,
          })
          localStorage.setItem("sansrut_user", JSON.stringify(data.user))
        }
      } catch (err) {
        // Offline / network failure fallback if token is found locally
        const raw = localStorage.getItem("sansrut_user")
        if (raw) {
          const parsed = JSON.parse(raw)
          setUser({
            name: parsed.name || "User",
            email: parsed.email || "",
            plan: parsed.plan || "FREE",
            apiCallCount: parsed.apiCallCount ?? 0,
            apiCallLimit: parsed.apiCallLimit ?? 1000,
          })
        } else {
          router.push("/auth")
          return
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("sansrut_token")
    localStorage.removeItem("sansrut_user")
    router.push("/auth")
  }

  // Page title from pathname
  const pageTitle = (() => {
    if (pathname === "/dashboard") return "Overview"
    if (pathname === "/dashboard/templates") return "Templates"
    if (pathname === "/dashboard/api-keys") return "API Keys"
    if (pathname === "/dashboard/logs") return "Email Logs"
    if (pathname?.startsWith("/dashboard/templates/")) return "Template Editor"
    return "Dashboard"
  })()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080f1c] flex flex-col items-center justify-center relative select-none">
        {/* Glow ambient balls */}
        <div className="absolute top-1/4 left-1/4 w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />
        
        <div className="flex flex-col items-center space-y-6 z-10">
          {/* Animated custom visual spinner */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin absolute" />
            <div className="w-8 h-8 rounded-lg bg-[#0b192c] flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">S</span>
            </div>
          </div>
          <div className="text-center space-y-1.5">
            <h2 className="text-white font-black tracking-tight text-base">Verifying credentials...</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Sanskarut Tech Team Secure Gateway</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fa] dark:bg-[#080f1c] font-sans">
      {/* ── Desktop Sidebar ────────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-white/5 sticky top-0 h-screen overflow-hidden">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* ── Main Workspace ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top Header Bar ─────────────────────────────────────────────── */}
        <header className="h-14 border-b border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-[#0a1220]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
          {/* Left: mobile menu + breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <SheetContent side="left" className="p-0 border-r-0 w-64 bg-transparent">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Dashboard navigation menu
                </SheetDescription>
                <SidebarContent
                  user={user}
                  onLogout={handleLogout}
                  onClose={() => setIsOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 dark:text-slate-500 font-medium hidden sm:block">
                Dashboard
              </span>
              {pathname !== "/dashboard" && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 hidden sm:block" />
                  <span className="font-bold text-[#0b192c] dark:text-white">
                    {pageTitle}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: notifications + user avatar */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>

            {/* Settings */}
            <button className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
              <Settings className="w-4 h-4" />
            </button>

            {/* Upgrade pill (only for FREE users) */}
            {user?.plan === "FREE" && (
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 transition-opacity">
                <Zap className="w-3 h-3" />
                Upgrade
              </button>
            )}

            {/* User avatar */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/8 ml-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-black text-[11px]">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-xs font-bold text-[#0b192c] dark:text-white truncate max-w-[100px]">
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium">{user.plan}</p>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <User className="w-3 h-3" />
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </header>

        {/* ── Page Content ───────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
