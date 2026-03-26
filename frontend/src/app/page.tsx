"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero/Hero'
import { HowItWorks } from '../components/sections/HowItWorks/HowItWorks'
import { CTA } from '../components/sections/CTA/CTA'

export default function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-slate-950 font-sans selection:bg-brand/20 selection:text-brand-light text-slate-200 overflow-x-hidden"
    >
      <Navbar />
      
      <main>
        <Hero />
        <HowItWorks />
        <CTA />
      </main>

      <Footer />
    </motion.div>
  )
}
