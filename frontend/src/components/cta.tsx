"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Sparkles } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b192c] via-[#0f2744] to-[#1a3a6b] p-10 sm:p-16 text-center text-white shadow-xl"
        >
          {/* Ambient visual objects */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-6">
            
            {/* Plan Sparkles Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Let&apos;s Engineer Together
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight leading-tight">
              Ready to Initiate Your Engineering Lifecycle?
            </h2>
            
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Partner with the Sanskarut Tech Team to build distributed API nodes, fast transactional mail gateway platforms, and premium customized software applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="#contact"
                className="w-full sm:w-auto bg-white hover:bg-blue-50 text-[#0b192c] font-black rounded-full px-8 py-4 text-sm transition-all shadow-lg flex items-center justify-center h-12 hover:scale-[1.01]"
              >
                Start Your Project
                <ArrowUpRight className="ml-2 w-4 h-4 text-[#0b192c]" />
              </Link>
              
              <Link
                href="#services"
                className="w-full sm:w-auto border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full px-8 py-4 text-sm transition-all flex items-center justify-center h-12"
              >
                Explore Offerings
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
