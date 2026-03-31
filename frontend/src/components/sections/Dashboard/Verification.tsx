"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, BotOff, UserCheck } from 'lucide-react'
import { WorldIDVerifyButton } from '../../../app/world-idkit-client'

export const Verification = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 md:p-16 flex flex-col items-center text-center space-y-10 md:space-y-12 max-w-2xl mx-auto w-full border-brand/20 shadow-3xl rounded-3xl md:rounded-[2.5rem] relative overflow-hidden bg-slate-900/60"
    >
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-50 animate-[scan_3s_linear_infinite]"></div>
      
      <div className="relative group">
        {/* Radar Pulse */}
        <div className="absolute inset-0 bg-brand/20 rounded-full animate-ping opacity-20 group-hover:bg-brand/40"></div>
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl bg-slate-950 flex items-center justify-center shadow-inner border border-white/5 relative z-10">
          <BotOff size={48} className="text-brand-light md:w-14 md:h-14 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight flex items-center justify-center gap-4 text-center">
          Humanity <br /> First
        </h2>
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
          TuliaPay uses World ID to proof personhood. Secure your vault against automated attacks while remaining 100% anonymous.
        </p>
      </div>

      <div className="flex flex-col w-full gap-8">
        <WorldIDVerifyButton />
        
        <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3">
          <Shield size={12} className="text-brand" /> Anonymous Cryptographic Verification
        </p>
      </div>

      {/* Decorative Blur */}
      <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-64 h-64 bg-brand/10 rounded-full blur-[80px]"></div>
    </motion.div>
  )
}
