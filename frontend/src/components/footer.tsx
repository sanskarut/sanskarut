"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Send, Twitter, Linkedin, Github, Instagram, Facebook } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
    }
  }

  const links = {
    company: [
      { name: "About Us", href: "/#why-choose-us" },
      { name: "API Reference", href: "/docs" },
      { name: "SLA & Pricing", href: "/pricing" },
      { name: "Privacy & NDA", href: "/privacy" },
      { name: "Contact Hub", href: "/#contact" },
    ],
    services: [
      { name: "Web Applications", href: "/#services" },
      { name: "SaaS Platforms", href: "/#services" },
      { name: "Custom Websites", href: "/#services" },
      { name: "Cloud Infrastructure", href: "/#services" },
    ],
    locations: [
      { name: "Mumbai Hub", href: "/services/web-development-mumbai" },
      { name: "India SaaS Hub", href: "/services/saas-development-india" },
    ],
  }

  return (
    <footer className="bg-[#0b192c] text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-900">
          
          {/* Logo & Brand Pitch - Col 3 */}
          <div className="md:col-span-3 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-heading font-black tracking-tight text-white flex items-center">
                sanskarut<span className="text-blue-500">.</span>
                <span className="text-xs font-bold text-blue-400 ml-2 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">team</span>
              </span>
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-sm">
              Deploying production-ready software systems, high-performance web products, and developer APIs designed by the Sanskarut Tech Team.
            </p>
            {/* Social Grid */}
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "https://x.com/sanskarut" },
                { icon: Instagram, href: "https://instagram.com/sanskarut.tech"},
                {icon: Facebook, href:"https://facebook.com/sanskarut"},
                { icon: Github, href: "https://github.com/sanskarut" },
              ].map((social, sIdx) => {
                const Icon = social.icon
                return (
                  <Link
                    key={sIdx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Links Column 1 - Col 2 */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-200">Company</h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              {links.company.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 - Col 2 */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-200">Capabilities</h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              {links.services.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 (Locations) - Col 2 */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-200">Local Focus</h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              {links.locations.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Form - Col 3 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-200">Subscribe for Updates</h4>
            <p className="text-sm font-medium leading-relaxed">
              Get monthly newsletters containing code recommendations, performance advice, and strategic engineering write-ups.
            </p>

            {subscribed ? (
              <div className="text-sm font-semibold text-green-400">
                Subscription successful! Welcome to Sanskarut.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex relative">
                <input
                  type="email"
                  required
                  placeholder="sanskar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Sanskarut Tech Team. All rights reserved.
          </div>
          <div>
            Made with Next.js & Tailwind CSS
          </div>
        </div>

      </div>
    </footer>
  )
}
