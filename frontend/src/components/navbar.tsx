"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: "Services", href: "/#services" },
    { name: "Process", href: "/#process" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Why Us", href: "/#why-choose-us" },
    { name: "Contact", href: "/#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white flex items-center">
            sanskarut<span className="text-blue-600">.</span>
            <span className="text-xs font-bold tracking-normal uppercase text-blue-600 ml-2 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full hidden sm:inline-block">tech team</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Button & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Link
            href="#contact"
            className={cn(
              buttonVariants({ variant: "default" }),
              "hidden md:inline-flex bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] dark:hover:bg-blue-500 dark:hover:text-white text-white rounded-full font-medium transition-all group px-5 py-2.5 items-center h-10"
            )}
          >
            Get Started
            <ArrowUpRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {/* Mobile Sheet Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-600 dark:text-slate-300"
                  aria-label="Open Menu"
                />
              }
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-900">
                  <SheetTitle className="text-xl font-heading font-black text-[#0b192c] dark:text-white flex items-center">
                    sanskarut<span className="text-blue-600">.</span>
                    <span className="text-[10px] font-bold uppercase text-blue-600 ml-1.5 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">team</span>
                  </SheetTitle>
                  <SheetDescription className="sr-only">Mobile Navigation Drawer</SheetDescription>
                </div>
                
                <nav className="mt-8 flex flex-col space-y-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors py-2 border-b border-slate-50 dark:border-slate-900/50"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-900">
                <Link
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-[#0b192c] hover:bg-blue-600 dark:bg-white dark:text-[#0b192c] text-white rounded-full font-medium py-3 flex items-center justify-center h-12"
                  )}
                >
                  Get Started
                  <ArrowUpRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
