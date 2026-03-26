"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Container, Section } from '../../ui/LayoutUtils'

export const Hero = () => {
  return (
    <Section padding="none" className="pt-40 pb-24">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <Container className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        <motion.div 
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-10 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand-light px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-brand/20">
            <Lock size={14} /> Confidential Payments
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Banking for <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-light to-emerald-400">humans</span>.
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Send, receive, and store assets privately using end-to-end encryption. 
            Verified by World ID, secured by FHE.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="white" size="xl" icon={ArrowRight} iconRight fullWidth>
                Launch App
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="xl" fullWidth>
                Experience FHE
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex-1 w-full max-w-xl lg:max-w-none relative"
        >
          <div className="relative group p-4">
            <div className="absolute inset-0 border-[2px] border-brand/20 rounded-[4rem] animate-[spin_20s_linear_infinite] opacity-50"></div>
            <Image 
              src="/tuliapay_hero_illustration_1774560012997.png" 
              alt="TuliaPay Secure Illustration" 
              width={800} 
              height={800}
              className="relative rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 transition-transform duration-700 hover:scale-[1.02] grayscale-[0.2] contrast-[1.1]"
            />
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
