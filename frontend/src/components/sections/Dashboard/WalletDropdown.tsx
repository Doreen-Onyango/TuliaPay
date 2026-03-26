"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Copy, Check, LogOut } from 'lucide-react'

interface WalletDropdownProps {
  address: string
  onDisconnect: () => void
}

export const WalletDropdown = ({ address, onDisconnect }: WalletDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-300 ${isOpen ? 'bg-slate-900 border-brand/50 text-white' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/20'}`}
      >
        <div className="w-2 h-2 bg-brand rounded-full"></div>
        <span className="font-mono text-xs">{truncatedAddress}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-6 w-80 glass-panel p-6 border-brand/30 shadow-3xl shadow-black/80 space-y-6 z-[200] bg-slate-900/95 rounded-[2rem]"
          >
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Connected Wallet</p>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/5 break-all font-mono text-xs text-brand-light leading-relaxed">
                {address}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={handleCopy}
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group"
              >
                <span className="text-sm font-bold text-slate-300">Copy Address</span>
                {isCopied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} className="text-slate-500 group-hover:text-white transition-colors" />}
              </button>

              <button 
                onClick={onDisconnect}
                className="w-full flex items-center justify-between p-4 bg-rose-500/5 rounded-xl hover:bg-rose-500/10 transition-colors border border-rose-500/10 group"
              >
                <span className="text-sm font-bold text-rose-400">Disconnect</span>
                <LogOut size={18} className="text-rose-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
