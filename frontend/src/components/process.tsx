"use client"

import React from "react"
import { motion } from "framer-motion"
import { Compass, Palette, Code2, ShieldAlert, Rocket } from "lucide-react"

export function Process() {
  const steps = [
    {
      num: "01",
      title: "Strategic Discovery",
      desc: "We define clear business goals, analyze competitor platforms, align stakeholders on measurable project KPIs, and establish an airtight scope.",
      icon: Compass,
    },
    {
      num: "02",
      title: "Conversion Prototyping",
      desc: "We design high-fidelity user interfaces and intuitive UX paths specifically planned to maximize user conversion and reduce drop-offs.",
      icon: Palette,
    },
    {
      num: "03",
      title: "Agile Development",
      desc: "Our engineers craft clean, scalable code using React, TypeScript, and Node.js, delivering fully functional, testable updates every week.",
      icon: Code2,
    },
    {
      num: "04",
      title: "Rigorous Testing & QA",
      desc: "We run end-to-end user path simulations, cross-device compatibility tests, data security validations, and Core Web Vital audits.",
      icon: ShieldAlert,
    },
    {
      num: "05",
      title: "Launch & Operational Handover",
      desc: "We deploy with zero-downtime, set up active platform performance monitors, and hand over fully documented repositories with clean operational guidelines.",
      icon: Rocket,
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 14 },
    },
  }

  return (
    <section id="process" className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
            Our Lifecycle
          </h2>
          <p className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
            Our Systematic Engineering Process
          </p>
          <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-4" />
        </div>

        {/* Workflow Timeline Timeline Grid */}
        <motion.div
          className="relative grid grid-cols-1 lg:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Timeline Linking Connection Line for desktop screens */}
          <div className="absolute top-[35px] left-[5%] right-[5%] h-[2px] bg-slate-100 dark:bg-slate-900 hidden lg:block z-0 pointer-events-none" />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center z-10 group"
              >
                {/* Milestone Node */}
                <div className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg mb-6 group-hover:border-blue-500 shadow-md transition-all duration-300 relative">
                  <Icon className="w-6 h-6" />
                  
                  {/* Step Identifier Index Bubble */}
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#0b192c] dark:bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                </div>

                {/* Content */}
                <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-900/30 p-5 rounded-2xl flex-1 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                  <h3 className="text-lg font-heading font-extrabold text-[#0b192c] dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
