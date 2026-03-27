"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Wallet, Eye, EyeOff, ArrowDownToLine, Send } from 'lucide-react'
import { Button } from '../../ui/Button'

interface BalanceCardProps {
  balance: string
  onToggle: () => void
  onAction: (tab: 'deposit' | 'send') => void
}

export const BalanceCard = ({ balance, onToggle, onAction }: BalanceCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-950/50 glass-panel border border-white/10 bg-slate-900/80 group"
    >
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-56 h-56 bg-brand/10 rounded-full blur-3xl group-hover:bg-brand/20 transition-colors duration-700 pointer-events-none"></div>
      <p className="text-white/80 font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2">
        <Wallet size={16} /> Encrypted Private Vault
      </p>
      
      <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-8">
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter">
            {balance !== "****" && "$"}
            {balance}
          </h2>
          <button 
            onClick={onToggle}
            className="p-4 md:p-5 bg-white/20 hover:bg-white/30 rounded-xl md:rounded-2xl transition-all text-white backdrop-blur-md active:scale-90"
          >
            {balance === "****" ? <Eye size={28} className="md:w-9 md:h-9" /> : <EyeOff size={28} className="md:w-9 md:h-9" />}
          </button>
        </div>
      </div>
      
      <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4 md:gap-6">
        <Button 
          variant="primary" 
          size="lg" 
          icon={ArrowDownToLine} 
          fullWidth 
          onClick={() => onAction('deposit')}
          className="md:text-xl py-4 md:py-5 shadow-2xl shadow-brand/20"
        >
          Deposit
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          icon={Send} 
          fullWidth 
          onClick={() => onAction('send')}
          className="md:text-xl py-4 md:py-5 bg-slate-800/50"
        >
          Send
        </Button>
      </div>
    </motion.div>
  )
}
