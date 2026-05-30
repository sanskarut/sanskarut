"use client"

import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Lock, FileText, Server, Eye, Key } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  const securityPractices = [
    {
      title: "Strict Mutual NDA Standards",
      desc: "Every partnership begins with a comprehensive, legal non-disclosure agreement. We guarantee that your business details, trade secrets, and logic pathways remain 100% private.",
      icon: FileText,
    },
    {
      title: "Isolated Code Repository Integrity",
      desc: "We organize all code repositories under isolated, corporate private environments. Code access is protected by multi-factor authentication (MFA) and limited strictly to active project squad members.",
      icon: Lock,
    },
    {
      title: "ISO-Grade Cryptographic Controls",
      desc: "We enforce secure HTTPS, TLS 1.3, and SHA-256 data transport standards. Database layers are fully encrypted at rest, protecting sensitive user registries and API metadata from vulnerabilities.",
      icon: Key,
    },
    {
      title: "Zero-Data Scraping Policy",
      desc: "We actively configure robots crawler limits to prevent public AI crawlers and data aggregators from scraping client documentation paths, dashboard data pools, or custom dashboards.",
      icon: Eye,
    },
  ]

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white dark:bg-slate-950 overflow-hidden relative pt-20">
        
        {/* Glow backgrounds */}
        <div className="absolute top-0 right-[-10%] w-[45%] h-[45%] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-[-10%] w-[35%] h-[35%] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />

        {/* Header */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-blue-800 dark:text-blue-300">
                Airtight Compliance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
              Privacy & Security Standards
            </h1>
            <div className="w-12 h-1 bg-blue-600 rounded mx-auto" />
            <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-455 max-w-xl mx-auto leading-relaxed">
              At the Sanskarut Tech Team, your proprietary intellectual property safety is our primary directive. Review our legal disclosures, codebase protections, and data safety compliance structures.
            </p>
          </div>
        </section>

        {/* Security Frameworks */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {securityPractices.map((practice, idx) => {
              const Icon = practice.icon
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-3xl p-8 sm:p-10 space-y-4 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-heading font-extrabold text-[#0b192c] dark:text-white">
                    {practice.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-550 dark:text-slate-350 leading-relaxed">
                    {practice.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Operational Compliance Note */}
        <section className="py-16 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h3 className="text-xl font-heading font-black text-[#0b192c] dark:text-white">
              Data Processing & General Disclosure
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-450 leading-relaxed">
              We process minimal employee and visitor data solely to maintain platform operations, execute secure portal logins, and secure API networks. We never resell, trade, or distribute your operational metrics, emails, or credentials to third-party marketing brokers.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
