"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Code2, Globe, Cpu } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 70, damping: 15 },
    },
  }

  const mockupVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 50, damping: 18, delay: 0.5 },
    },
  }

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 py-20 lg:py-32">
      {/* Decorative Grid and Ambient Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Blue Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-[#0b192c]/5 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-3.5 py-1.5 rounded-full mb-6">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-blue-800 dark:text-blue-300">
              Digital Engineering & Next-Gen Architecture
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-[1.1] mb-6"
          >
            Architecting high-performance{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Web & SaaS Solutions
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-8"
          >
            We partner with visionary companies to design, build, and deploy production-grade software applications, custom websites, and digital ecosystems that scale.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="#contact"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full sm:w-auto bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] dark:hover:bg-blue-500 dark:hover:text-white text-white font-semibold rounded-full px-8 py-6 text-base shadow-lg shadow-blue-500/10 transition-all group flex items-center justify-center h-12"
              )}
            >
              Work with Us
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="#services"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm font-semibold rounded-full px-8 py-6 text-base text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center h-12"
              )}
            >
              Explore Services
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup Presentation */}
        <motion.div
          className="max-w-5xl mx-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2 shadow-2xl relative overflow-hidden backdrop-blur-md"
          variants={mockupVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Window Control Dots */}
          <div className="flex items-center space-x-1.5 pb-2.5 px-3 border-b border-slate-100 dark:border-slate-900">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-400 font-mono ml-4 select-none">sanskarut-tech-team-v2.ts</span>
          </div>

          {/* Interactive Mock SVG Interface */}
          <div className="aspect-[16/9] w-full bg-slate-50 dark:bg-slate-950 rounded-lg overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Sidebar Mock */}
            <div className="w-full md:w-52 border-r border-slate-200/50 dark:border-slate-900 p-4 space-y-4 hidden md:block">
              <div className="h-8 bg-blue-100/70 dark:bg-blue-950/40 rounded-md flex items-center px-2 space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <div className="w-16 h-2.5 bg-blue-500/40 rounded" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md flex items-center px-2 space-x-2 cursor-pointer transition-colors">
                    <div className="w-3.5 h-3.5 rounded bg-slate-300 dark:bg-slate-800" />
                    <div className="w-20 h-2 bg-slate-300/60 dark:bg-slate-800/60 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Active Nodes", val: "148 / 150", color: "text-green-500" },
                  { label: "User Sessions", val: "24.8k (+12%)", color: "text-blue-500" },
                  { label: "Response Latency", val: "38ms (Avg)", color: "text-indigo-500" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-3.5 rounded-lg">
                    <div className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">{stat.label}</div>
                    <div className={`text-xs sm:text-base lg:text-lg font-bold mt-1 ${stat.color}`}>{stat.val}</div>
                  </div>
                ))}
              </div>

              {/* Chart Mock */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-lg flex flex-col justify-between h-40 sm:h-52 relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Transaction Volume</div>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                </div>
                
                {/* SVG Graph Animation */}
                <div className="flex-1 w-full relative overflow-hidden flex items-end">
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,35 Q10,15 20,25 T40,12 T60,28 T80,10 T100,20 L100,40 L0,40 Z"
                      fill="url(#chartGlow)"
                    />
                    <path
                      d="M0,35 Q10,15 20,25 T40,12 T60,28 T80,10 T100,20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Grid Lines */}
                  <div className="w-full flex justify-between text-[9px] text-slate-400 dark:text-slate-600 font-mono mt-auto border-t border-slate-100 dark:border-slate-900 pt-1 relative z-10">
                    <span>Q1</span>
                    <span>Q2</span>
                    <span>Q3</span>
                    <span>Q4</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
