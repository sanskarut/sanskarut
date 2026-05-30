"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { History, Search, Filter, HelpCircle, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  timestamp: string;
  status: "Delivered" | "Failed";
  errorMessage?: string;
}

export default function LogsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Delivered" | "Failed">("all")

  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch email transmission logs from MongoDB on component mount
  useEffect(() => {
    async function fetchLogs() {
      try {
        const token = localStorage.getItem("sansrut_token")
        if (!token) return

        const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
        const res = await fetch(`${API_URL}/api/v1/emails/logs`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (data.success) {
          setLogs(data.logs)
        } else {
          setError(data.message || "Failed to retrieve email logs.")
        }
      } catch (err) {
        setError("Network error. Unable to contact log server.")
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  // Filter logs by search string and status selection
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.recipient.toLowerCase().includes(search.toLowerCase()) ||
      log.subject.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ? true : log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 select-none">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white flex items-center">
          <History className="mr-3 w-8 h-8 text-blue-600 dark:text-blue-400" />
          Email Transmission Logs
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
          Review live transaction histories, packet timestamps, and failure diagnostics from your API calls.
        </p>
      </div>

      {/* Filter and Search Bar row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search recipient or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
          />
        </div>

        {/* Status Filters Toggle row */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
          {[
            { val: "all", label: "All Logs" },
            { val: "Delivered", label: "Success" },
            { val: "Failed", label: "Failed" },
          ].map((btn) => (
            <button
              key={btn.val}
              onClick={() => setStatusFilter(btn.val as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === btn.val
                  ? "bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-955"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main logs table Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-900 pb-5">
          <CardTitle className="text-lg font-heading font-extrabold text-[#0b192c] dark:text-white">Transaction Logs</CardTitle>
          <CardDescription className="text-xs font-semibold text-slate-500">
            A comprehensive list of API-initiated emails dispatched from your developer accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/30 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100 dark:border-slate-900">
                  <th className="px-6 py-4">Recipient Address</th>
                  <th className="px-6 py-4">Subject Line</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Delivery Status</th>
                  <th className="px-6 py-4">Failure Diagnostics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-semibold text-slate-700 dark:text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      Loading transaction logs from MongoDB database...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-red-500 font-medium">
                      {error}
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredLogs.map((log) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                      >
                        <td className="px-6 py-4 truncate max-w-[200px] font-extrabold text-[#0b192c] dark:text-white">{log.recipient}</td>
                        <td className="px-6 py-4 truncate max-w-[250px] font-medium">{log.subject}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">{log.timestamp}</td>
                        <td className="px-6 py-4">
                          {log.status === "Delivered" ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Success</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/20">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Failed</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500 max-w-[200px] truncate">
                          {log.errorMessage ? (
                            <span className="text-red-500 flex items-center space-x-1.5">
                              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{log.errorMessage}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">None</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}

                {!loading && !error && filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No matching log files detected. Refine your search inputs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
