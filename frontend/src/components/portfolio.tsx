"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, Globe, Code2, Sparkles, X, CheckCircle, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Project {
  title: string
  category: string
  desc: string
  tech: string[]
  icon: React.ComponentType<any>
  color: string
  metric: string
  challenge: string
  strategy: string
  result: string
  image: string
}

export function Portfolio() {
  const [filter, setFilter] = useState("all")
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null)

  const categories = [
    { label: "All Projects", value: "all" },
    { label: "Web Applications", value: "webapp" },
    { label: "SaaS Platforms", value: "saas" },
    { label: "Websites", value: "website" },
  ]

  const projects: Project[] = [
    {
      title: "Nova SaaS Analytics",
      category: "saas",
      desc: "An enterprise analytical console measuring system operations, transactional lifecycles, and database request pools.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts"],
      icon: Layers,
      color: "from-blue-600/20 to-indigo-600/20",
      metric: "42% Server Cost Reduction",
      challenge: "Nova SaaS faced severe scalability issues. Concurrent transactional loads caused server processing spikes and database lockouts, threatening customer trust and increasing infrastructure spend to unsustainable levels.",
      strategy: "We redesigned their data pipeline using decoupled serverless queues, implemented an intelligent multi-tenant caching layer, and built a custom visual monitoring console using Next.js and Tailwind CSS.",
      result: "Server operational overhead dropped by 42% while scaling concurrent user capacity 10x. System processing latency fell to under 38ms average, ensuring seamless transactional throughput.",
      image: "/images/nova_dashboard_mockup.png",
    },
    {
      title: "Pulse Medical Portal",
      category: "webapp",
      desc: "A custom medical portal supporting secure booking systems, automated scheduling, and encrypted transfers.",
      tech: ["React", "Node.js", "PostgreSQL", "Socket.io"],
      icon: Code2,
      color: "from-[#0b192c]/20 to-blue-600/20",
      metric: "60% Friction Reduction",
      challenge: "Pulse Portal relied on slow, manual medical scheduling grids. Patients experienced booking drop-offs, and administrators spent over 30 hours weekly coordinating shifts manually.",
      strategy: "We engineered an automated schedule optimization engine, integrated real-time patient notifications, and secured all system data with end-to-end HTTPS/SHA-256 protocols.",
      result: "Patient booking friction fell by 60%, scaling the platform capacity to handle over 50,000 monthly bookings securely. Administrative coordination overhead was reduced to zero.",
      image: "/images/nova_dashboard_mockup.png",
    },
    {
      title: "Horizon Realty Platform",
      category: "website",
      desc: "A premium corporate marketing presence featuring interactive real estate listings and search interfaces.",
      tech: ["Next.js", "Stitch CMS", "Tailwind", "Framer Motion"],
      icon: Globe,
      color: "from-blue-600/20 to-teal-500/20",
      metric: "35% Conversion Boost",
      challenge: "Horizon Realty's legacy marketing platform loaded slowly (5.4s average), causing a 48% bounce rate among high-intent property searchers.",
      strategy: "We architected a fully static website with Next.js pre-rendering, integrated headless Stitch CMS for rapid editor publishing, and built dynamic, custom list filtering workflows.",
      result: "Average page loading speed improved to 1.1s, boosting search conversion rates by 35% and increasing mobile real estate listing engagement by 80%.",
      image: "/images/nova_dashboard_mockup.png",
    },
    {
      title: "Flow ERP Systems",
      category: "saas",
      desc: "An integrated cloud resource engine orchestrating corporate assets, automated invoicing, and staff permissions.",
      tech: ["Next.js", "GraphQL", "Amazon RDS", "Tailwind CSS"],
      icon: Layers,
      color: "from-indigo-600/20 to-purple-600/20",
      metric: "50% Efficiency Increase",
      challenge: "Flow ERP suffered from fragmented regional databases. Department assets, employee timesheets, and invoicing records were out of sync, leading to double-entry overhead and payroll lag.",
      strategy: "We unified their architecture under a secure GraphQL API endpoint connected to a central PostgreSQL Amazon RDS instance, wrapping it in a highly responsive glassmorphic interface.",
      result: "Cross-department operational efficiency increased by 50%. Invoice generation lag dropped from 7 business days to near-instantaneous automated delivery.",
      image: "/images/nova_dashboard_mockup.png",
    },
    {
      title: "Aura Creative Agency Hub",
      category: "website",
      desc: "A sleek marketing portfolio platform featuring complex layout structures and fast static execution.",
      tech: ["Next.js", "Tailwind CSS", "Tailwind Animate", "Vercel"],
      icon: Globe,
      color: "from-blue-500/20 to-cyan-400/20",
      metric: "2.4s Speed Improvement",
      challenge: "Aura Creative's visual media assets slowed page load speeds, hindering search engine indexing and causing prospect drop-offs.",
      strategy: "We implemented static pre-rendering, optimized media CDN delivery pathways, structured semantic SEO hierarchies, and optimized core bundles.",
      result: "Page load speeds improved by 2.4s, boosting organic crawl rates by 120% and generating a 40% increase in inbound sales inquiries within 60 days.",
      image: "/images/nova_dashboard_mockup.png",
    },
    {
      title: "Apex Finance Ledger",
      category: "webapp",
      desc: "An algorithmic budgeting dashboard visualizing transaction records and multi-signature security status.",
      tech: ["TypeScript", "Next.js 15", "Shadcn UI", "Tailwind CSS"],
      icon: Code2,
      color: "from-[#0b192c]/40 to-slate-900/40",
      metric: "28% Checkout Growth",
      challenge: "Apex Finance's checkout flow had high abandonment rates because patients/users encountered payment gate delays and confusing transaction states.",
      strategy: "We engineered an optimized multi-sig wallet integration with real-time web-socket updates, built custom checkout state dashboards, and unified visual transaction metrics.",
      result: "Transaction completion rates grew by 28% and scaled concurrent transactional handling capacity to 10k/sec with zero packet losses.",
      image: "/images/nova_dashboard_mockup.png",
    },
  ]

  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="portfolio" className="py-24 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
            Case Studies & Proof
          </h2>
          <p className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
            Our Featured Engagements
          </p>
          <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-4" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-5 leading-relaxed">
            Click any case study card below to inspect the full business challenge, engineering strategy, and verified outcomes.
          </p>
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
                  onClick={() => setActiveCaseStudy(proj)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 flex flex-col group relative cursor-pointer"
                >
                  {/* Decorative Background Color Block */}
                  <div className={`h-48 bg-gradient-to-br ${proj.color} flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                    
                    {/* Floating Mesh circles */}
                    <div className="absolute w-28 h-28 rounded-full bg-blue-500/10 blur-xl -top-6 -right-6" />
                    <div className="absolute w-20 h-20 rounded-full bg-indigo-500/10 blur-lg -bottom-4 -left-4" />

                    <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-white/20 dark:border-slate-800 flex items-center justify-center text-[#0b192c] dark:text-blue-400 shadow-md">
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Hover Overlay indicator */}
                    <div className="absolute inset-0 bg-[#0b192c]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <span className="bg-white text-[#0b192c] px-4 py-2 rounded-full font-bold text-xs shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Inspect Case Study
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-1.5 items-center mb-3">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded">
                          {proj.category === "saas" ? "SaaS Platform" : proj.category === "webapp" ? "Web Application" : "Website"}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded flex items-center gap-1">
                          <Sparkles className="w-3 h-3 animate-pulse" />
                          {proj.metric}
                        </span>
                      </div>
                      <h3 className="text-xl font-heading font-extrabold text-[#0b192c] dark:text-white mb-2">
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

      {/* Case Study Dialog Modal */}
      <Dialog open={!!activeCaseStudy} onOpenChange={(open) => !open && setActiveCaseStudy(null)}>
        <DialogContent className="max-w-4xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0 overflow-hidden shadow-2xl flex flex-col">
          {activeCaseStudy && (
            <>
              {/* Header Visual Bar */}
              <div className="relative h-60 bg-[#0b192c] overflow-hidden flex items-center justify-center">
                <img
                  src={activeCaseStudy.image}
                  alt={activeCaseStudy.title}
                  className="w-full h-full object-cover opacity-90 blur-[1px] hover:blur-0 transition-all duration-500"
                />
                {/* Floating overlay gradient to text */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                {/* Visual Header Text */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded">
                    Case Study Review
                  </span>
                  <DialogTitle className="text-3xl font-heading font-black text-white mt-2.5">
                    {activeCaseStudy.title}
                  </DialogTitle>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="p-8 sm:p-10 space-y-6 overflow-y-auto max-h-[500px]">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (Details) - 7 cols */}
                  <div className="md:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                        The Challenge
                      </h4>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeCaseStudy.challenge}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Engineering Strategy
                      </h4>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeCaseStudy.strategy}
                      </p>
                    </div>
                  </div>

                  {/* Right Column (Metrics & Info) - 5 cols */}
                  <div className="md:col-span-5 space-y-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80">
                    
                    {/* Big Metric Outcome Box */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        Verified Business Outcome
                      </h4>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                        {activeCaseStudy.metric}
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-450 leading-relaxed mt-2">
                        {activeCaseStudy.result}
                      </p>
                    </div>

                    {/* Tech details */}
                    <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Deploy Stack
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCaseStudy.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Trust confirmation stamp */}
                    <div className="flex items-center space-x-2 pt-2 text-[10px] text-emerald-600 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Outcome · Mapped to SLA Delivery</span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
                <Button
                  onClick={() => setActiveCaseStudy(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
                  variant="outline"
                >
                  Close Case Study
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </section>
  )
}
