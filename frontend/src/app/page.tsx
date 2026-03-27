"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero/Hero'
import { Benefits } from '../components/sections/Benefits/Benefits'
import { HowItWorks } from '../components/sections/HowItWorks/HowItWorks'
import { CTA } from '../components/sections/CTA/CTA'

export default function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-slate-950 font-sans selection:bg-brand/20 selection:text-brand-light text-slate-200 overflow-x-hidden relative"
    >
      {/* Global Glows */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-30 z-50"></div>
      
      <Navbar />
      
      <main>
        <Hero />
        <Benefits />
        <div className="relative">
           <div className="absolute top-1/2 left-0 w-full h-[600px] bg-brand/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
           <HowItWorks />
        </div>
        <CTA />
      </main>

      <Footer />
    </motion.div>
  )
}
