"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  BookOpen,
  KeyRound,
  Send,
  Layers,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ChevronRight,
  Info,
} from "lucide-react"

type DocSection = "getting-started" | "auth" | "direct-send" | "template-send" | "playground"

export default function DocsPage() {
  const [activeSec, setActiveSec] = useState<DocSection>("getting-started")
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // API Playground State
  const [apiKey, setApiKey] = useState("")
  const [recipient, setRecipient] = useState("")
  const [sendMode, setSendMode] = useState<"direct" | "template">("direct")
  
  // Direct fields
  const [directSubject, setDirectSubject] = useState("Gateway System Notification")
  const [directTitle, setDirectTitle] = useState("Critical Core Event")
  const [directBody, setDirectBody] = useState("This is an automated log packet dispatched through the API Gateway.")
  
  // Dynamic Templates & Variables State
  const [templateSlug, setTemplateSlug] = useState("welcome")
  const [sendByTemplateId, setSendByTemplateId] = useState(false)
  const [dbTemplates, setDbTemplates] = useState<any[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [templateLoadError, setTemplateLoadError] = useState<string | null>(null)
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({})

  const [apiStatus, setApiStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [apiResponse, setApiResponse] = useState<any>(null)

  // 1. Fetch available templates from MongoDB direct API in real-time when API key is inputted
  React.useEffect(() => {
    const fetchTemplates = async () => {
      const trimmedKey = apiKey.trim()
      if (!trimmedKey || trimmedKey.length < 15) {
        setDbTemplates([])
        setTemplateLoadError(null)
        return
      }

      setIsLoadingTemplates(true)
      setTemplateLoadError(null)

      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
        const res = await fetch(`${API_URL}/api/v1/emails/templates`, {
          headers: {
            "Authorization": `Bearer ${trimmedKey}`,
          },
        })

        const data = await res.json()
        if (res.ok && data.success) {
          setDbTemplates(data.templates)
          if (data.templates.length > 0) {
            setTemplateSlug(data.templates[0].slug)
          }
        } else {
          setTemplateLoadError(data.message || "Failed to fetch templates using this API Key.")
          setDbTemplates([])
        }
      } catch (err: any) {
        setTemplateLoadError(err.message || "Unable to reach templates server.")
        setDbTemplates([])
      } finally {
        setIsLoadingTemplates(false)
      }
    }

    const timer = setTimeout(() => {
      fetchTemplates()
    }, 500)

    return () => clearTimeout(timer)
  }, [apiKey])

  const activeTemplateObj = dbTemplates.find((t) => t.slug === templateSlug)

  // 2. Parse variables/placeholders from selected template dynamically (regex-driven compilation)
  React.useEffect(() => {
    let placeholders: string[] = []
    if (activeTemplateObj) {
      const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g
      const matches = new Set<string>()
      let match
      while ((match = regex.exec(activeTemplateObj.subject)) !== null) {
        matches.add(match[1])
      }
      while ((match = regex.exec(activeTemplateObj.htmlContent)) !== null) {
        matches.add(match[1])
      }
      placeholders = Array.from(matches)
    } else {
      // Fallback based on standard seeded template slugs
      if (templateSlug === "welcome") {
        placeholders = ["name", "body", "ctaText", "ctaUrl"]
      } else if (templateSlug === "otp-verification") {
        placeholders = ["otp", "expiresIn"]
      } else if (templateSlug === "thank-you") {
        placeholders = ["name", "message"]
      }
    }

    const initialVars: Record<string, string> = {}
    placeholders.forEach((p) => {
      if (templateVariables[p] !== undefined) {
        initialVars[p] = templateVariables[p]
      } else {
        if (p === "name") initialVars[p] = "Sanskar Sharma"
        else if (p === "body" || p === "message") initialVars[p] = "Your transactional process completed successfully."
        else if (p === "ctaText") initialVars[p] = "View Status"
        else if (p === "ctaUrl") initialVars[p] = "http://localhost:3000/dashboard"
        else if (p === "otp") initialVars[p] = "582914"
        else if (p === "expiresIn") initialVars[p] = "10"
        else initialVars[p] = ""
      }
    })
    setTemplateVariables(initialVars)
  }, [templateSlug, activeTemplateObj])

  const copyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const handleTestApi = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim() || !recipient.trim()) {
      alert("Please provide both your Developer API Key and a recipient email.")
      return
    }

    setApiStatus("sending")
    setApiResponse(null)

    try {
      const payload: any = { to: recipient.trim() }

      if (sendMode === "direct") {
        payload.subject = directSubject
        payload.title = directTitle
        payload.bodyContent = directBody
      } else {
        if (sendByTemplateId && activeTemplateObj) {
          payload.templateId = activeTemplateObj.id
        } else {
          payload.templateSlug = templateSlug
        }
        payload.variables = templateVariables
      }

      const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
      const res = await fetch(`${API_URL}/api/v1/emails/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      setApiResponse(data)

      if (res.ok && data.success) {
        setApiStatus("success")
      } else {
        setApiStatus("error")
      }
    } catch (err: any) {
      setApiStatus("error")
      setApiResponse({
        success: false,
        error: "Connection failure",
        message: err.message || "Unable to reach the API server. Ensure backend is running.",
      })
    }
  }

  const curlDirectSnippet = `curl -X POST http://localhost:4000/api/v1/emails/send \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "to": "recipient@example.com",
    "subject": "Gateway Alert",
    "title": "System Diagnostic Completed",
    "bodyContent": "Transactional email cycle successfully finished."
  }'`

  const curlTemplateSnippet = `curl -X POST http://localhost:4000/api/v1/emails/send \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "to": "recipient@example.com",
    "templateSlug": "welcome",
    "variables": {
      "name": "Sanskar Sharma",
      "body": "Welcome to the Sanskarut Tech Team email gateway.",
      "ctaText": "Open Dashboard",
      "ctaUrl": "http://localhost:3000/dashboard"
    }
  }'`

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f6fa] dark:bg-[#080f1c] text-slate-700 dark:text-slate-300 font-sans py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-12 border-b border-slate-200/60 dark:border-white/5 pb-8">
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white flex items-center">
              <BookOpen className="mr-3.5 w-8 h-8 text-blue-600 dark:text-blue-400" />
              API Documentation
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
              Learn how to integrate transactional mail dispatches using the Sanskarut Tech Team Developer Gateway.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation - Col 3 */}
            <aside className="lg:col-span-3 space-y-2 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 px-3 tracking-widest block mb-3">
                Core Reference
              </span>
              {[
                { id: "getting-started", label: "Getting Started", icon: BookOpen },
                { id: "auth", label: "Authorization", icon: KeyRound },
                { id: "direct-send", label: "Direct Sending", icon: Send },
                { id: "template-send", label: "Template Sending", icon: Layers },
                { id: "playground", label: "API Playground", icon: Terminal },
              ].map((item) => {
                const Icon = item.icon
                const isActive = activeSec === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSec(item.id as DocSection)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] shadow-md"
                        : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-[#0b192c] dark:hover:text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                )
              })}
            </aside>

            {/* Content pane - Col 9 */}
            <div className="lg:col-span-9 space-y-6">
              
              <AnimatePresence mode="wait">
                {/* Getting started */}
                {activeSec === "getting-started" && (
                  <motion.div
                    key="getting-started"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6"
                  >
                    <h2 className="text-2xl font-heading font-black text-[#0b192c] dark:text-white">
                      Getting Started
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                      Welcome to the developer gateway repository. Our high-performance email SaaS allows you to route critical system alerts, user welcome onboarding details, and verification codes dynamically using a REST API.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 p-4 rounded-xl flex items-start space-x-3 text-xs text-blue-800 dark:text-blue-300 font-semibold leading-relaxed">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        The gateway server runs locally at <code className="font-mono bg-blue-100/50 dark:bg-blue-900/50 px-1 rounded text-blue-700 dark:text-blue-300">http://localhost:4000</code>. Check standard server console messages to see delivery simulations in dev mode.
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Authorization */}
                {activeSec === "auth" && (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6"
                  >
                    <h2 className="text-2xl font-heading font-black text-[#0b192c] dark:text-white">
                      Authentication
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                      All REST request flows directed toward the dispatches portal require developer authentication tokens. Keys are configured locally inside the Developer Dashboard tab.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-4 space-y-3 font-semibold">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-wide">Request Header</div>
                      <div className="font-mono text-xs text-[#0b192c] dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        Authorization: Bearer sk_sansrut_your_api_key_string
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      API tokens represent cryptographically secure credentials. The server retains strictly SHA-256 hashes of these values, preventing reverse plaintext leaks.
                    </p>
                  </motion.div>
                )}

                {/* Direct Sending */}
                {activeSec === "direct-send" && (
                  <motion.div
                    key="direct-send"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6"
                  >
                    <h2 className="text-2xl font-heading font-black text-[#0b192c] dark:text-white">
                      Direct Email Sending
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                      Submit immediate standalone email variables directly using custom subject lines, cards, and bottom CTA buttons.
                    </p>

                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">HTTP Request</h3>
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-500 text-white font-black text-[10px] px-2.5 py-1 rounded">POST</span>
                        <code className="font-mono text-xs text-[#0b192c] dark:text-slate-200">/api/v1/emails/send</code>
                      </div>
                    </div>

                    {/* curl section */}
                    <div className="space-y-2 relative">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>Example cURL Request</span>
                        <button
                          onClick={() => copyCode(curlDirectSnippet, "direct")}
                          className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                        >
                          {copiedText === "direct" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText === "direct" ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="bg-slate-950 text-slate-300 font-mono text-[11px] p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-900">
                        {curlDirectSnippet}
                      </pre>
                    </div>
                  </motion.div>
                )}

                {/* Template Sending */}
                {activeSec === "template-send" && (
                  <motion.div
                    key="template-send"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6"
                  >
                    <h2 className="text-2xl font-heading font-black text-[#0b192c] dark:text-white">
                      Template-Based Sending
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                      Trigger rich HTML layouts (like Welcomes, OTPs, or Thank You cards) by supplying either the template alphanumeric <code className="font-mono bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded text-blue-600">templateSlug</code> or its database hexadecimal <code className="font-mono bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded text-blue-600">templateId</code>, along with a custom dictionary of key-value replacement <code className="font-mono bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded text-blue-600">variables</code>.
                    </p>

                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">HTTP Request</h3>
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-500 text-white font-black text-[10px] px-2.5 py-1 rounded">POST</span>
                        <code className="font-mono text-xs text-[#0b192c] dark:text-slate-200">/api/v1/emails/send</code>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-5">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Query Available Templates</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Query the direct API to retrieve the list of all active templates, their MongoDB hexadecimal IDs, and default subjects:
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500 text-white font-black text-[10px] px-2.5 py-1 rounded">GET</span>
                        <code className="font-mono text-xs text-[#0b192c] dark:text-slate-200">/api/v1/emails/templates</code>
                      </div>
                      
                      <pre className="bg-slate-950 text-slate-300 font-mono text-[11px] p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-900">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  http://localhost:4000/api/v1/emails/templates`}
                      </pre>
                    </div>

                    {/* Supported slugs */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-900 rounded-xl space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Supported Seeded Slugs</h4>
                      <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold">
                        <span className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200/30">welcome</span>
                        <span className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200/30">otp-verification</span>
                        <span className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200/30">thank-you</span>
                      </div>
                    </div>

                    {/* curl section */}
                    <div className="space-y-2 relative">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>Example cURL Request</span>
                        <button
                          onClick={() => copyCode(curlTemplateSnippet, "template")}
                          className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                        >
                          {copiedText === "template" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText === "template" ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="bg-slate-950 text-slate-300 font-mono text-[11px] p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-900">
                        {curlTemplateSnippet}
                      </pre>
                    </div>
                  </motion.div>
                )}

                {/* API Playground */}
                {activeSec === "playground" && (
                  <motion.div
                    key="playground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-heading font-black text-[#0b192c] dark:text-white flex items-center">
                        <Terminal className="mr-2.5 w-6 h-6 text-blue-500" />
                        API Playground
                      </h2>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        Input an active developer token to trigger actual emails from this browser viewport.
                      </p>
                    </div>

                    <form onSubmit={handleTestApi} className="space-y-6">
                      
                      {/* Token & To */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="play-key" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            Developer API Key
                          </label>
                          <input
                            id="play-key"
                            type="password"
                            required
                            placeholder="sk_sansrut_••••••••••••••••"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="play-recipient" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            Recipient Email
                          </label>
                          <input
                            id="play-recipient"
                            type="email"
                            required
                            placeholder="recipient@example.com"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Mode Choice */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          Payload Mode
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "direct", label: "Direct Payload" },
                            { id: "template", label: "Template Slug" },
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSendMode(opt.id as any)}
                              className={`py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                sendMode === opt.id
                                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400"
                                  : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mode Fields */}
                      <AnimatePresence mode="wait">
                        {sendMode === "direct" ? (
                          <motion.div
                            key="direct-fields"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-900"
                          >
                            <div className="space-y-1.5">
                              <label htmlFor="play-subject" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                Email Subject Line
                              </label>
                              <input
                                id="play-subject"
                                type="text"
                                required
                                value={directSubject}
                                onChange={(e) => setDirectSubject(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label htmlFor="play-title" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                Email Header Title
                              </label>
                              <input
                                id="play-title"
                                type="text"
                                required
                                value={directTitle}
                                onChange={(e) => setDirectTitle(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label htmlFor="play-body" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                Email Body Content
                              </label>
                              <textarea
                                id="play-body"
                                rows={3}
                                required
                                value={directBody}
                                onChange={(e) => setDirectBody(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white resize-none"
                              />
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="template-fields"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-900"
                          >
                            <div className="space-y-1.5">
                              <label htmlFor="play-temp-slug" className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                                <span>Select Email Template</span>
                                {isLoadingTemplates && (
                                  <span className="text-[9px] text-blue-500 animate-pulse font-bold lowercase">Loading system templates...</span>
                                )}
                              </label>
                              <select
                                id="play-temp-slug"
                                value={templateSlug}
                                onChange={(e) => setTemplateSlug(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                              >
                                {dbTemplates.length > 0 ? (
                                  dbTemplates.map((t) => (
                                    <option key={t.id} value={t.slug}>
                                      {t.name} ({t.slug}) - ID: {t.id}
                                    </option>
                                  ))
                                ) : (
                                  <>
                                    <option value="welcome">welcome (Welcome Email)</option>
                                    <option value="otp-verification">otp-verification (OTP Verification)</option>
                                    <option value="thank-you">thank-you (Thank You Email)</option>
                                  </>
                                )}
                              </select>
                            </div>

                            {dbTemplates.length > 0 && (
                              <div className="flex items-center space-x-2 pt-1 pb-2">
                                <input
                                  id="send-by-id"
                                  type="checkbox"
                                  checked={sendByTemplateId}
                                  onChange={(e) => setSendByTemplateId(e.target.checked)}
                                  className="w-3.5 h-3.5 text-blue-600 border-slate-200 dark:border-slate-800 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="send-by-id" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                                  Send using database hexadecimal Template ID instead of Slug
                                </label>
                              </div>
                            )}

                            {templateLoadError && (
                              <div className="text-[10px] font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-200/20">
                                Info: {templateLoadError} (Using standard offline seeded placeholders)
                              </div>
                            )}

                            <div className="space-y-3 pt-2">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                                Template Key-Value Variables
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.keys(templateVariables).map((vKey) => (
                                  <div key={vKey} className="space-y-1.5">
                                    <label htmlFor={`play-var-${vKey}`} className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                                      <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-blue-200/10">{"{{" + vKey + "}}"}</span>
                                      <span>Variable</span>
                                    </label>
                                    <input
                                      id={`play-var-${vKey}`}
                                      type="text"
                                      required
                                      value={templateVariables[vKey] || ""}
                                      onChange={(e) => setTemplateVariables(prev => ({ ...prev, [vKey]: e.target.value }))}
                                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                                    />
                                  </div>
                                ))}
                                {Object.keys(templateVariables).length === 0 && (
                                  <p className="text-xs text-slate-400 italic col-span-2">This template does not require any variable placeholders.</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Response Diagnostic Box */}
                      <AnimatePresence>
                        {apiStatus !== "idle" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`border rounded-2xl p-5 space-y-3 font-semibold ${
                              apiStatus === "sending"
                                ? "bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-900"
                                : apiStatus === "success"
                                ? "bg-green-50 dark:bg-green-950/20 border-green-200/30 text-green-700 dark:text-green-400"
                                : "bg-red-50 dark:bg-red-950/20 border-red-200/30 text-red-700 dark:text-red-400"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-xs font-black uppercase">
                              {apiStatus === "sending" ? (
                                <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin" />
                              ) : apiStatus === "success" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span>
                                {apiStatus === "sending"
                                  ? "Transmitting Request..."
                                  : apiStatus === "success"
                                  ? "Response Code 202: Dispatch Success"
                                  : "Response Code 400/401: Delivery Error"}
                              </span>
                            </div>

                            {apiResponse && (
                              <pre className="bg-slate-950 text-slate-300 font-mono text-[10px] p-3 rounded-lg border border-slate-900 leading-relaxed select-text overflow-x-auto max-h-40">
                                {JSON.stringify(apiResponse, null, 2)}
                              </pre>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        disabled={apiStatus === "sending"}
                        className="w-full bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] dark:hover:bg-blue-500 dark:hover:text-white text-white rounded-xl py-4.5 font-bold transition-all shadow-md flex items-center justify-center cursor-pointer"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Execute API Call
                      </button>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
