"use client"

import React from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

interface TeamMember {
  name: string
  role: string
  bio: string
  initials: string
  image: string
  socials: {
    twitter?: string
    linkedin?: string
    github?: string
    email?: string
  }
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Sanskar Sharma",
    role: "Founder & Chief Strategist",
    bio: "Pioneering highly scalable enterprise SaaS ecosystems, distributed gateway interfaces, and transaction life cycles.",
    initials: "SS",
    image: "/images/sanskar.png",
    socials: {
      github: "https://github.com/sanskarut",
      linkedin: "https://linkedin.com/company/sanskarut",
      twitter: "https://twitter.com/sanskarut",
      email: "mailto:sanskar@sanskarut.com",
    },
  },
  {
    name: "Priya Nair",
    role: "Lead Systems Architect",
    bio: "Specializing in high-performance Node processes, cloud database scaling, secure SMTP transit, and data streaming pipelines.",
    initials: "PN",
    image: "/images/priya.png",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:priya@sanskarut.com",
    },
  },
  {
    name: "Kabir Verma",
    role: "Principal UI/UX Architect",
    bio: "Crafting beautiful glassmorphic visual interactions, premium responsive layouts, and highly interactive user states.",
    initials: "KV",
    image: "/images/kabir.png",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
]

export function Team() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 15 },
    },
  }

  return (
    <section id="team" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/3 left-[-10%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3 animate-pulse">
            Meet the Engineers
          </h2>
          <p className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
            Sanskarut Tech Team
          </p>
          <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-4" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-5 leading-relaxed">
            We are a group of system architects, UI designers, and SaaS specialists dedicated to deploying production-ready code.
          </p>
        </div>

        {/* Cards Deck */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              className="group relative border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-8 rounded-3xl shadow-sm hover:shadow-[0_30px_60px_rgba(59,130,246,0.18)] hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle glassmorphic radial hover highlight inside card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/5 to-indigo-50/10 dark:to-indigo-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Visual Image Avatar Wrapper */}
                <div className="w-20 h-20 mb-6 relative group/avatar shrink-0">
                  {/* Outer glowing background blur */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-indigo-500 to-teal-400 rounded-2xl blur-md opacity-0 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500" />
                  
                  {/* Spinning Gradient Border Ring */}
                  <div className="absolute inset-[-3px] rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-teal-400 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 pointer-events-none" />
                  
                  {/* Avatar Container */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-[2px] z-10 flex items-center justify-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-heading font-black text-[#0b192c] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                  {member.role}
                </p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Social Media Link Icons */}
              <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
                {member.socials.github && (
                  <motion.a
                    href={member.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                    aria-label="GitHub Account"
                    whileHover={{ scale: 1.2, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Github className="w-4 h-4" />
                  </motion.a>
                )}
                {member.socials.linkedin && (
                  <motion.a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="LinkedIn Account"
                    whileHover={{ scale: 1.2, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Linkedin className="w-4 h-4" />
                  </motion.a>
                )}
                {member.socials.twitter && (
                  <motion.a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                    aria-label="Twitter Account"
                    whileHover={{ scale: 1.2, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Twitter className="w-4 h-4" />
                  </motion.a>
                )}
                {member.socials.email && (
                  <motion.a
                    href={member.socials.email}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Email Address"
                    whileHover={{ scale: 1.2, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Mail className="w-4 h-4" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
