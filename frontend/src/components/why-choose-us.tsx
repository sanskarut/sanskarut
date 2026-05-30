"use client"

import React from "react"
import { motion } from "framer-motion"
import { Flame, Zap, ShieldAlert, Award } from "lucide-react"

export function WhyChooseUs() {
  const valueProps = [
    {
      title: "Proven Business ROI",
      desc: "Our engineered systems have helped clients slash operational expenses by up to 40% and increase user transaction conversions by 25%.",
      icon: Zap,
    },
    {
      title: "Scale Without Friction",
      desc: "We build enterprise-grade architectures that handle 10x spikes in traffic seamlessly, ensuring your business stays online when it matters most.",
      icon: Flame,
    },
    {
      title: "Rock-Solid Data Integrity",
      desc: "Protecting your brand and client trust with ISO-grade secure data transfers, encrypted registries, and zero historical security breaches.",
      icon: ShieldAlert,
    },
    {
      title: "Guaranteed Sprint Delivery",
      desc: "Weekly transparent sprint reviews, interactive roadmaps, and dedicated engineers that deliver high-quality, production-ready code on time.",
      icon: Award,
    },
  ]

  const stats = [
    { num: "40%+", label: "Avg Client ROI" },
    { num: "10x+", label: "Scale Capacity" },
    { num: "100%", label: "On-Time Delivery" },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 14 },
    },
  }

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 14 },
    },
  }

  return (
    <section id="why-choose-us" className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative">
      
      {/* Decorative Lights */}
      <div className="absolute top-[40%] left-[-10%] w-[35%] h-[35%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Title & Statistics */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
                Why Partner with Us
              </h2>
              <p className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
                Engineering Digital Frameworks Designed to Scale
              </p>
              <div className="w-12 h-1 bg-blue-600 rounded mt-4" />
            </div>

            <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              We do not build average, generic websites. We design custom-coded, resilient, high-speed architectures mapped specifically to support enterprise growth models and high-traffic loads.
            </p>

            {/* Metrics List */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-900"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {stats.map((st, idx) => (
                <motion.div key={idx} variants={statVariants} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black font-heading text-[#0b192c] dark:text-blue-400">
                    {st.num}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {st.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Value Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {valueProps.map((prop, index) => {
              const Icon = prop.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-900/30 p-6 rounded-2xl space-y-4 hover:shadow-lg hover:border-blue-500/10 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-extrabold text-[#0b192c] dark:text-white mb-2">
                      {prop.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {prop.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
