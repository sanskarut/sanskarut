"use client"

import React from "react"
import { motion } from "framer-motion"
import { Code2, Laptop, ShieldCheck, Database, Layers, GitBranch, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function Services() {
  const offerings = [
    {
      title: "Web Application Development",
      description: "Rigorous, high-performance web products constructed with modern architectures like Next.js, React, and TypeScript. Optimized for load speed, scalability, and robust user interface operations.",
      icon: Code2,
      features: ["Next.js & Server Components", "REST & GraphQL API Endpoints", "Performance Optimization"],
      link: "/services/web-development-mumbai",
    },
    {
      title: "Custom Websites",
      description: "Premium digital representation systems that stand out. Tailored carefully for marketing platforms, enterprise corporate presences, and digital lead-capturing hubs.",
      icon: Laptop,
      features: ["Responsive Design Layouts", "SEO Optimized Architecture", "Stitch CMS Integrations"],
    },
    {
      title: "SaaS Solutions",
      description: "Multi-tenant business software engineering from database schemas to client dashboards. Built with resilient security policies and secure payment integrations.",
      icon: Layers,
      features: ["Stripe / Billing Hooks", "Secure JWT Authorization", "Interactive Data Analytics"],
      link: "/services/saas-development-india",
    },
    {
      title: "Scalable Cloud Architecture",
      description: "Automated pipelines and backend cloud setups designed to absorb spikes in request traffic. Designed using containerization and serverless infrastructure models.",
      icon: Database,
      features: ["AWS / Vercel Cloud Nodes", "Docker Container Workloads", "CI/CD Git Workflows"],
    },
    {
      title: "API Design & Systems Integration",
      description: "Secure, documented API designs built for third-party platforms. Enabling seamless synchronization of customer databases with your existing ERP/CRM networks.",
      icon: GitBranch,
      features: ["Swagger API Schema Documentation", "Webhook Broadcast Hubs", "Microservices Networking"],
    },
    {
      title: "Security & Auditing Systems",
      description: "Detailed evaluation of code files, network configurations, and database permissions. Hardening structures against vulnerability threats.",
      icon: ShieldCheck,
      features: ["Penetration Threat Scans", "GDPR / Compliance Guarding", "Data Encryption standards"],
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 14 },
    },
  }

  return (
    <section id="services" className="py-24 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
            Expert Capabilities
          </h2>
          <p className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
            High-Performance Digital Engineering Services
          </p>
          <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-4" />
        </div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {offerings.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div key={index} variants={cardVariants} className="h-full">
                <Card className="h-full border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 group flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardHeader className="pt-8">
                    {/* Icon Bubble */}
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-heading font-extrabold text-[#0b192c] dark:text-white mb-2">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-8 flex-1 flex flex-col justify-between">
                    <ul className="space-y-2.5 mb-6">
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {item.link ? (
                      <Link href={item.link} className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group/link mt-auto">
                        Explore Regional Service
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <div className="h-4" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
