"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, ShieldCheck, Mail, MapPin, Sparkles, Terminal } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MumbaiServicePage() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 15 } },
  }

  const stats = [
    { num: "40%+", label: "Avg Client Cost Savings" },
    { num: "10x+", label: "Platform Transaction Scale" },
    { num: "100%", label: "An-Time Sprint Delivery" },
  ]

  const features = [
    {
      title: "Mumbai Enterprise Architecture",
      desc: "Architecting secure, high-concurrency core portals for leading financial, logistical, and digital brands in India's commercial capital.",
    },
    {
      title: "Tailored Regional Performance",
      desc: "Optimizing code configurations for local latency limits and high mobile usage, achieving sub-second loads on local Indian network matrices.",
    },
    {
      title: "Strict Indian SLA Compliance",
      desc: "Protecting local brand integrations with local data security standards, rigorous contract terms, and guaranteed support limits.",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white dark:bg-slate-950 overflow-hidden relative pt-20">
        
        {/* Glow backgrounds */}
        <div className="absolute top-0 left-[-10%] w-[45%] h-[45%] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[35%] h-[35%] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />

        {/* Hero Section */}
        <section className="py-20 lg:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-4xl mx-auto space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-3.5 py-1.5 rounded-full">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-blue-800 dark:text-blue-300">
                  Mumbai Engineering Hub
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight"
              >
                Enterprise Web Application{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  Engineering in Mumbai
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
              >
                We build high-performance corporate applications and scalable SaaS layers designed to optimize administrative efficiency, lower processing overhead, and boost transaction conversion for Mumbai’s leading enterprises.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/#contact"
                  className="w-full sm:w-auto bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] dark:hover:bg-blue-500 dark:hover:text-white text-white font-semibold rounded-full px-8 py-4 text-base shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center h-12"
                >
                  Consult an Architect
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/#portfolio"
                  className="w-full sm:w-auto border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm font-semibold rounded-full px-8 py-4 text-base text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center h-12"
                >
                  Inspect Case Studies
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Local Credibility Metrics */}
        <section className="py-12 border-y border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((st, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black font-heading text-blue-600 dark:text-blue-400">
                    {st.num}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Value Props */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                Regional Focus
              </h2>
              <h3 className="text-3xl sm:text-4xl font-heading font-black text-[#0b192c] dark:text-white leading-tight">
                Aligning Global Development Quality with Local Market Speeds
              </h3>
              <div className="w-12 h-1 bg-blue-600 rounded" />
              <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-450 leading-relaxed pt-2">
                Mumbai’s digital landscape is fast, competitive, and highly demanding. We eliminate standard agency friction by bringing dedicated, senior software architects directly into your engineering lifecycle, ensuring 100% on-time delivery.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((ft, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-base sm:text-lg font-heading font-black text-[#0b192c] dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    {ft.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-455 mt-2.5 leading-relaxed">
                    {ft.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact/CTA section */}
        <section className="py-24 bg-[#0b192c] text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_40%)]" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <Terminal className="w-12 h-12 text-blue-400 mx-auto" />
            <h3 className="text-3xl sm:text-4xl font-heading font-black">
              Ready to Optimize Your Web Architecture?
            </h3>
            <p className="text-sm sm:text-base text-slate-350 max-w-xl mx-auto leading-relaxed">
              Consult with our founder, Sanskar Bandgar, to align on custom project scopes, timeline SLA parameters, and target ROI requirements.
            </p>
            <div className="pt-4">
              <Link href="/#contact">
                <Button className="bg-white text-[#0b192c] hover:bg-blue-600 hover:text-white font-bold rounded-full px-8 py-6 text-sm cursor-pointer h-12 shadow-lg">
                  Initialize Consultation Process
                </Button>
              </Link>
            </div>
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
