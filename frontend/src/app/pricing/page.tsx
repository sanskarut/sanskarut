"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ShieldCheck, Zap, Layers, Sparkles, Terminal, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PricingPage() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 15 } },
  }

  const tiers = [
    {
      name: "MVP Acceleration Tier",
      price: "$8,500",
      period: "Fixed Scope",
      desc: "Perfect for scaling startups looking to validate products rapidly with high-performance code.",
      features: [
        "Complete Web App / SaaS Prototype",
        "Conversion-Optimized UX Paths",
        "Next.js, TypeScript & Tailwind CSS",
        "Fully Documented Code Handover",
        "Standard SLA Compliance Support",
      ],
      popular: false,
      cta: "Launch Prototype Sprint",
    },
    {
      name: "Scale Sprint Squad",
      price: "$6,200",
      period: "per bi-weekly sprint",
      desc: "Continuous dedicated senior engineering squad to accelerate features and lower technical debt.",
      features: [
        "Dedicated Senior Architect & Developers",
        "Active Slack/Teams Collaboration Channels",
        "Weekly Production-Ready Releases",
        "Database & API Speed Optimizations",
        "Priority 4-Hour Support SLA",
      ],
      popular: true,
      cta: "Retain Engineering Squad",
    },
    {
      name: "Enterprise SLA Management",
      price: "Custom",
      period: "Annual Contract",
      desc: "Full-scale managed software engineering, secure hosting maintenance, and guaranteed uptime agreements.",
      features: [
        "Unlimited Sprint Scalability",
        "Guaranteed 99.9% Uptime SLA",
        "Periodic ISO Security Audits",
        "Decoupled Serverless Infrastructure",
        "24/7 Priority Emergency Pager",
      ],
      popular: false,
      cta: "Establish Enterprise SLA",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white dark:bg-slate-950 overflow-hidden relative pt-20">
        
        {/* Glow backgrounds */}
        <div className="absolute top-0 left-[-10%] w-[45%] h-[45%] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[35%] h-[35%] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />

        {/* Header */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-blue-800 dark:text-blue-300">
                Transparent SLA Frameworks
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
              Flexible Engagement Packages
            </h1>
            <div className="w-12 h-1 bg-blue-600 rounded mx-auto" />
            <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-450 max-w-xl mx-auto leading-relaxed">
              No hidden fees. We map our transparent pricing packages directly to verified milestone parameters and guaranteed SLA compliance.
            </p>
          </div>
        </section>

        {/* Tiers Grid */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {tiers.map((tier, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`group relative border rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  tier.popular
                    ? "border-blue-500 bg-blue-50/10 dark:bg-slate-900/80 dark:border-blue-400/80"
                    : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40"
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Zap className="w-3 h-3 fill-white" />
                    Highly Recommended
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-black text-[#0b192c] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tier.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-450 mt-2 leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>

                  <div className="py-4 border-y border-slate-100 dark:border-slate-800/80 flex items-baseline">
                    <span className="text-4xl font-heading font-black text-[#0b192c] dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-xs font-bold text-slate-450 ml-2">
                      / {tier.period}
                    </span>
                  </div>

                  <ul className="space-y-3.5 pt-2">
                    {tier.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start text-xs sm:text-sm font-medium text-slate-550 dark:text-slate-350 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mr-2.5 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link href="/#contact">
                    <Button className={`w-full font-bold rounded-xl py-6 cursor-pointer shadow-md ${
                      tier.popular
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-[#0b192c] hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-white"
                    }`}>
                      {tier.cta}
                    </Button>
                  </Link>
                </div>

              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* SLA Guarantee Note */}
        <section className="py-24 bg-[#0b192c] text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_40%)]" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <Terminal className="w-12 h-12 text-blue-400 mx-auto" />
            <h3 className="text-3xl sm:text-4xl font-heading font-black">
              Underwritten SLA Milestone Guarantees
            </h3>
            <p className="text-sm sm:text-base text-slate-350 max-w-xl mx-auto leading-relaxed">
              We stand behind our code. Every single scope agreement we sign is underwritten with transparent delay penalties and strict quality parameters, ensuring absolute deployment confidence.
            </p>
            <div className="flex items-center justify-center space-x-2 text-[10px] sm:text-xs text-slate-400 pt-4">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span>Full NDA Compliance Guarantee · 4-Hour Response Guarantee</span>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
