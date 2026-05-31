"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, CheckCircle2, ShieldCheck, Mail, MapPin, Phone } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "webapp", message: "" })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error")
      return
    }

    setStatus("submitting")
    // Mocking server action call
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/emails/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        },
        body: JSON.stringify({
          to: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
          subject: "Project Inquiry",
          title: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
          bodyContent: `<h1>Project Inquiry</h1><p><strong>Name:</strong> ${formData.name}</p><p><strong>Email:</strong> ${formData.email}</p><p><strong>Message:</strong> ${formData.message}</p>`
        })
      })
      const res2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/emails/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        },
        body: JSON.stringify({
          to: formData.email,
          templateSlug: "website-contact"
        })
      })
    } catch (error) {
      console.log(error)
    }
    setStatus("success")
    setFormData({ name: "", email: "", projectType: "webapp", message: "" })
  }

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
            Get in Touch
          </h2>
          <p className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white leading-tight">
            Initiate Your Engineering Lifecycle
          </p>
          <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
          {/* Info Card - Column 5 */}
          <div className="lg:col-span-5 bg-[#0b192c] text-white p-8 sm:p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-xl">
            {/* Ambient Background Circles */}
            <div className="absolute w-44 h-44 rounded-full bg-blue-500/10 blur-xl -bottom-10 -right-10 pointer-events-none" />

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-heading font-black">
                  Let&apos;s Build Together
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-2.5">
                  Have a complex SaaS idea, custom website project, or custom application code? We have the team to deploy it.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Us</div>
                    <div className="text-sm font-semibold text-slate-200">support@sanskarut.qzz.io</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Call Directly</div>
                    <div className="text-sm font-semibold text-slate-200">+91 87675 95276</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Headquarters</div>
                    <div className="text-sm font-semibold text-slate-200">Baramati, Pune, Maharashtra, India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Note */}
            <div className="flex items-center space-x-2.5 pt-8 lg:pt-0 border-t border-slate-800 text-xs text-slate-400 font-semibold mt-8 lg:mt-0">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-400 flex-shrink-0" />
              <span>We strictly respect NDA guidelines. All project files remain fully secure.</span>
            </div>
          </div>

          {/* Form Box - Column 7 */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 rounded-3xl flex flex-col justify-center shadow-md relative">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/50 flex items-center justify-center text-green-500 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-[#0b192c] dark:text-white">
                    Transmission Success!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you. Your project request has been captured in our system. A project strategist will reach out to you within 4 business hours.
                  </p>
                  <Button
                    onClick={() => setStatus("idle")}
                    variant="outline"
                    className="rounded-full border-slate-200 dark:border-slate-800"
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Sanskar Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="sanskar@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                    />
                  </div>

                  {/* Project Type Buttons */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Core Needs
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: "webapp", label: "Web App" },
                        { val: "saas", label: "SaaS Dev" },
                        { val: "website", label: "Website" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: opt.val })}
                          className={`py-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${formData.projectType === opt.val
                            ? "bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-600 dark:text-blue-400"
                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message details */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Message details
                    </label>
                    <Textarea
                      id="message"
                      required
                      rows={4}
                      placeholder="Describe your engineering needs..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white"
                    />
                  </div>

                  {/* Error State Banner */}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 font-semibold"
                    >
                      Please ensure all form inputs are properly filled out.
                    </motion.div>
                  )}

                  {/* Submit Trigger */}
                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] dark:hover:bg-blue-500 dark:hover:text-white text-white rounded-full font-bold py-4 transition-all flex items-center justify-center cursor-pointer shadow-md"
                  >
                    {status === "submitting" ? (
                      <span className="flex items-center space-x-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Packets...</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Initialize Lifecycle
                        <Send className="ml-2 w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Premium Location Map Section ("mapcn") */}
        <div className="mt-16 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md relative h-80 bg-slate-900">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60652.667726026724!2d74.5389096461165!3d18.173505560400855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc3a03bdb59287f%3A0x36e4fb47fb8d8a9d!2sBaramati%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1780073423035!5m2!1sen!2sin"
            className="w-full h-full border-0 grayscale dark:invert dark:contrast-90 dark:opacity-85"
            allowFullScreen={false}
            loading="lazy"
            title="Sanskarut Location Map"
          />

          {/* Ambient Overlay to blend map frame with aesthetics */}
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
        </div>

      </div>
    </section>
  )
}
