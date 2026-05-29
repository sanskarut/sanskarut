"use client"

import React from "react"
import { motion } from "framer-motion"
import { Star, CheckCircle } from "lucide-react"

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aravind Iyer",
    role: "CTO",
    company: "Finova Cloud Platforms",
    content: "The email gateway is blazing fast. The secure SHA-256 key authorization and immediate SMTP logs give our developers complete visibility. Working with the Sanskarut Tech Team was seamless.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Engineering Director",
    company: "AppCore Solutions",
    content: "Sanskarut Tech Team saved us dozens of custom SMTP configuration hours. Their rate-limiting handles are rock solid under heavy API volumes, and delivery is extremely reliable.",
    rating: 5,
  },
  {
    name: "Rohan Das",
    role: "Product Lead",
    company: "CloudMesh Technologies",
    content: "We use their Developer Gateway daily to dispatch automated transaction receipts. The table layouts are highly compatible with Outlook and Gmail, and the API has never failed.",
    rating: 5,
  },
]

export function Testimonials() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 70, damping: 14 },
    },
  }

  return (
    <section id="feedback" className="py-24 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
            Client Success
          </h2>
          <p className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
            Partner Feedback
          </p>
          <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-4" />
        </div>

        {/* Feedback Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Star rating display */}
                <div className="flex items-center space-x-1 text-amber-400 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Verified Partner profile info */}
              <div className="flex items-center space-x-3.5 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-500 font-extrabold text-xs">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-black text-[#0b192c] dark:text-white">{t.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10 shrink-0" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
