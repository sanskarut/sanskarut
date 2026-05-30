"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Layers, Globe, Code2 } from "lucide-react"

export function Portfolio() {
  const [filter, setFilter] = useState("all")

  const categories = [
    { label: "All Projects", value: "all" },
    { label: "Web Applications", value: "webapp" },
    { label: "SaaS Platforms", value: "saas" },
    { label: "Websites", value: "website" },
  ]

  const projects = [
    {
      title: "Nova SaaS Analytics",
      category: "saas",
      desc: "An enterprise analytical console measuring node operations, conversion pipelines, and live database request pools.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts"],
      icon: Layers,
      color: "from-blue-600/20 to-indigo-600/20",
    },
    {
      title: "Pulse Medical Portal",
      category: "webapp",
      desc: "A custom medical portal supporting real-time staff scheduling, virtual booking systems, and encrypted data transfer protocols.",
      tech: ["React", "Node.js", "PostgreSQL", "Socket.io"],
      icon: Code2,
      color: "from-[#0b192c]/20 to-blue-600/20",
    },
    {
      title: "Horizon Realty Platform",
      category: "website",
      desc: "A premium corporate marketing presence featuring interactive real estate lists, geographic searches, and custom styling.",
      tech: ["Next.js", "Stitch CMS", "Tailwind", "Framer Motion"],
      icon: Globe,
      color: "from-blue-600/20 to-teal-500/20",
    },
    {
      title: "Flow ERP Systems",
      category: "saas",
      desc: "An integrated cloud resource engine orchestrating company assets, invoice generation pipelines, and staff permissions.",
      tech: ["Next.js", "GraphQL", "Amazon RDS", "Tailwind CSS"],
      icon: Layers,
      color: "from-indigo-600/20 to-purple-600/20",
    },
    {
      title: "Aura Creative Agency Hub",
      category: "website",
      desc: "A sleek marketing portfolio platform featuring complex layout adjustments and fast static load execution.",
      tech: ["Next.js", "Tailwind CSS", "Tailwind Animate", "Vercel"],
      icon: Globe,
      color: "from-blue-500/20 to-cyan-400/20",
    },
    {
      title: "Apex Finance Ledger",
      category: "webapp",
      desc: "An algorithmic budgeting dashboard visualizing user transaction histories, token trades, and multi-signature wallets.",
      tech: ["TypeScript", "Next.js 15", "Shadcn UI", "Tailwind CSS"],
      icon: Code2,
      color: "from-[#0b192c]/40 to-slate-900/40",
    },
  ]

  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="portfolio" className="py-24 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
            Case Studies
          </h2>
          <p className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
            Our Featured Engagements
          </p>
          <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-4" />
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                filter === cat.value
                  ? "bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] shadow-lg shadow-[#0b192c]/10"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => {
              const Icon = proj.icon
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={proj.title}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 flex flex-col group relative"
                >
                  {/* Decorative Background Color Block */}
                  <div className={`h-48 bg-gradient-to-br ${proj.color} flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                    
                    {/* Floating Mesh circles */}
                    <div className="absolute w-28 h-28 rounded-full bg-blue-500/10 blur-xl -top-6 -right-6" />
                    <div className="absolute w-20 h-20 rounded-full bg-indigo-500/10 blur-lg -bottom-4 -left-4" />

                    <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-white/20 dark:border-slate-800 flex items-center justify-center text-[#0b192c] dark:text-blue-400 shadow-md">
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Hover Link Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-white text-[#0b192c] flex items-center justify-center font-bold shadow-md hover:scale-110 transition-transform">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded">
                        {proj.category === "saas" ? "SaaS Platform" : proj.category === "webapp" ? "Web Application" : "Website"}
                      </span>
                      <h3 className="text-xl font-heading font-extrabold text-[#0b192c] dark:text-white mt-3 mb-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                        {proj.desc}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-900">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  )
}
