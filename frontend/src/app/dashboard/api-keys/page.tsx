"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { KeyRound, Plus, Trash2, Copy, Check, Info, ShieldCheck, Terminal } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface APIKey {
  id: string;
  name: string;
  maskedKey: string;
  createdAt: string;
  lastUsed: string;
  isRevoked: boolean;
}

export default function APIKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [isPlaintextOpen, setIsPlaintextOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [generatedPlaintextKey, setGeneratedPlaintextKey] = useState("")
  const [copied, setCopied] = useState(false)

  // Fetch API keys from the secure database on component mount
  useEffect(() => {
    async function fetchKeys() {
      try {
        const token = localStorage.getItem("sansrut_token")
        if (!token) return

        const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
        const res = await fetch(`${API_URL}/api/v1/api-keys`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (data.success) {
          setKeys(data.keys)
        } else {
          setError(data.message || "Failed to retrieve API credentials.")
        }
      } catch (err) {
        setError("Network error. Unable to contact key server.")
      } finally {
        setLoading(false)
      }
    }
    fetchKeys()
  }, [])

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    try {
      const token = localStorage.getItem("sansrut_token")
      if (!token) return

      const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
      const res = await fetch(`${API_URL}/api/v1/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newKeyName.trim() }),
      })

      const data = await res.json()
      if (data.success && data.key && data.plaintextKey) {
        setGeneratedPlaintextKey(data.plaintextKey)
        setKeys([data.key, ...keys])
        setNewKeyName("")
        setIsGenerateOpen(false)
        setIsPlaintextOpen(true)
      } else {
        alert(data.message || "Failed to create API key.")
      }
    } catch {
      alert("Network error. Failed to create API key.")
    }
  }

  const handleRevokeKey = async (id: string) => {
    const confirmRevoke = window.confirm(
      "Are you sure you want to revoke this API key? Downstream applications using this token will fail immediately."
    )
    if (!confirmRevoke) return

    try {
      const token = localStorage.getItem("sansrut_token")
      if (!token) return

      const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
      const res = await fetch(`${API_URL}/api/v1/api-keys/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (data.success) {
        setKeys(keys.filter((key) => key.id !== id))
      } else {
        alert(data.message || "Failed to revoke key.")
      }
    } catch {
      alert("Network error. Failed to revoke API key.")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPlaintextKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white flex items-center">
            <KeyRound className="mr-3 w-8 h-8 text-blue-600 dark:text-blue-400" />
            Developer API Keys
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            Manage cryptographically secure credentials to authorize transaction logs and email tasks.
          </p>
        </div>
        
        <Button
          onClick={() => setIsGenerateOpen(true)}
          className="bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] dark:hover:bg-blue-500 dark:hover:text-white rounded-xl py-5 px-5 font-bold shadow-md cursor-pointer flex items-center"
        >
          <Plus className="mr-2 w-4 h-4" />
          Generate New Key
        </Button>
      </div>

      {/* API Key Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Tokens", val: keys.length, desc: "Hashed and configured credentials" },
          { label: "Active Nodes", val: keys.filter(k => !k.isRevoked).length, desc: "Open listener channels" },
          { label: "Total Requests", val: "128,432", desc: "Total incoming HTTP packets" }
        ].map((metric, idx) => (
          <Card key={idx} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl">
            <CardHeader className="pb-3.5">
              <CardDescription className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{metric.label}</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-black font-heading text-[#0b192c] dark:text-blue-400 mt-1">{metric.val}</CardTitle>
              <p className="text-[11px] font-semibold text-slate-500 mt-1.5">{metric.desc}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Main Keys Management Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-900 pb-5">
          <CardTitle className="text-lg font-heading font-extrabold text-[#0b192c] dark:text-white">Active Credentials</CardTitle>
          <CardDescription className="text-xs font-semibold text-slate-500">
            Plaintext API keys are never stored on the server. We keep only secure SHA-256 hashes of your tokens.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/30 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100 dark:border-slate-900">
                  <th className="px-6 py-4">Key Label Name</th>
                  <th className="px-6 py-4">Masked String Prefix</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4 text-right">Revoke Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-semibold text-slate-700 dark:text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      Loading API credentials from MongoDB...
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
                    {keys.map((key) => (
                      <motion.tr
                        key={key.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                      >
                        <td className="px-6 py-4 font-extrabold text-[#0b192c] dark:text-white">{key.name}</td>
                        <td className="px-6 py-4 font-mono text-xs">{key.maskedKey}</td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{key.createdAt}</td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">{key.lastUsed}</td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRevokeKey(key.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer"
                            aria-label="Revoke Credential Key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}

                {!loading && !error && keys.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No active API keys found. Generate a new key above to start testing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Name Form Generation Dialog Modal */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={handleGenerateKey} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-heading font-black text-[#0b192c] dark:text-white flex items-center">
                <Terminal className="mr-2.5 w-5 h-5 text-blue-500" />
                Generate API Key
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-slate-500 mt-1">
                Name your key to easily identify it later. Access tokens will be locked behind secure SHA-256 hashes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label htmlFor="keyName" className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Key Label Name
              </label>
              <input
                id="keyName"
                type="text"
                required
                placeholder="e.g. Production Webhook Gateway"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-900">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsGenerateOpen(false)}
                className="rounded-xl cursor-pointer font-bold text-slate-500"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] text-white rounded-xl px-5 font-bold cursor-pointer"
              >
                Create Key
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Step 2: Hashed Plaintext Key Warning Dialog Modal */}
      <Dialog open={isPlaintextOpen} onOpenChange={setIsPlaintextOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-heading font-black text-blue-600 dark:text-blue-400 flex items-center">
                <ShieldCheck className="mr-2.5 w-6 h-6 text-green-500" />
                API Token Created Successfully
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-slate-500 mt-1">
                For security reasons, this plaintext token will be shown **EXACTLY ONCE**. You must copy and safeguard it now.
              </DialogDescription>
            </DialogHeader>

            {/* Plaintext Token Code Box */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-4 flex items-center justify-between font-mono text-xs text-[#0b192c] dark:text-slate-200 relative overflow-hidden">
              <span className="select-all font-bold pr-4 truncate">{generatedPlaintextKey}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={copyToClipboard}
                className="text-slate-500 hover:text-[#0b192c] dark:hover:text-white shrink-0 cursor-pointer rounded-lg border border-slate-200/40 dark:border-slate-800/80 bg-white dark:bg-slate-900"
                aria-label="Copy plain text api key"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* Crucial Security Warning Alert Box */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 p-4 rounded-xl flex items-start space-x-3 text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                If you lose this key, you will not be able to retrieve it. You will have to revoke the credentials and generate a new key token.
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-900">
              <Button
                type="button"
                onClick={() => setIsPlaintextOpen(false)}
                className="bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] text-white rounded-xl px-6 font-bold cursor-pointer w-full sm:w-auto"
              >
                I have saved this key
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
