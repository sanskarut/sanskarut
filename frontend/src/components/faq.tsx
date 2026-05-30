"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"

import { FAQ_ITEMS } from "@/lib/faq-data"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 15 },
    },
  }

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 right-[-10%] w-[35%] h-[35%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-3.5 py-1.5 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-blue-800 dark:text-blue-300">
              Clear Answers
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-4" />
          <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-5 leading-relaxed">
            Everything you need to know about our modern technical stack, project delivery timeline, and maintenance.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/60 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-6 sm:p-8 flex items-center justify-between space-x-4 cursor-pointer focus:outline-none relative group"
                  aria-expanded={isOpen}
                  id={`faq-btn-${idx}`}
                >
                  <span className="text-base sm:text-lg font-bold text-[#0b192c] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 border-t border-slate-100 dark:border-slate-800/60 text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
