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
      className="relative overflow-hidden rounded-[3rem] p-12 shadow-3xl shadow-brand/20 bg-gradient-to-br from-brand via-brand/90 to-brand-light border border-white/20 group"
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
      <p className="text-white/80 font-black uppercase tracking-widest text-xs flex items-center gap-2">
        <Wallet size={16} /> Encrypted Private Vault
      </p>
      
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h2 className="text-8xl font-black text-white tracking-tighter">
            {balance !== "****" && "$"}
            {balance}
          </h2>
          <button 
            onClick={onToggle}
            className="p-5 bg-white/20 hover:bg-white/30 rounded-2xl transition-all text-white backdrop-blur-md active:scale-90"
          >
            {balance === "****" ? <Eye size={36} /> : <EyeOff size={36} />}
          </button>
        </div>
      </div>
      
      <div className="mt-14 flex gap-6">
        <Button 
          variant="white" 
          size="xl" 
          icon={ArrowDownToLine} 
          fullWidth 
          onClick={() => onAction('deposit')}
        >
          Deposit
        </Button>
        <Button 
          variant="glass" 
          size="xl" 
          icon={Send} 
          fullWidth 
          onClick={() => onAction('send')}
        >
          Send
        </Button>
      </div>
    </motion.div>
  )
}
