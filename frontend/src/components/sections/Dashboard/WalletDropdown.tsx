"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Copy, Check, LogOut, User, Zap, ExternalLink, ShieldCheck } from 'lucide-react'
import { useAtom } from 'jotai'
import { encryptedBalanceAtom, isVerifiedHumanAtom } from '../../../store'

interface WalletDropdownProps {
  address: string
  onDisconnect: () => void
}

export const WalletDropdown = ({ address, onDisconnect }: WalletDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [balance] = useAtom(encryptedBalanceAtom)
  const [isVerified] = useAtom(isVerifiedHumanAtom)

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
        className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 ${isOpen ? 'bg-slate-900 border-brand text-white shadow-lg shadow-brand/10' : 'bg-slate-900/50 border-white/5 text-slate-300 hover:border-white/20'}`}
      >
        <div className="w-2 h-2 bg-brand-light rounded-full animate-pulse shadow-[0_0_8px_rgba(167,139,250,0.5)]"></div>
        <span className="font-bold text-sm tracking-tight">{truncatedAddress}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-light' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for easy closing */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="absolute right-0 top-full pt-2 w-[calc(100vw-2rem)] sm:w-80 z-50"
            >
              <div className="glass-panel border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-950/98 backdrop-blur-3xl">
              {/* Header Profile Section */}
              <div className="p-6 bg-gradient-to-br from-brand/20 via-transparent to-brand/5 border-b border-white/5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand-light">
                    <User size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-tight">Main Vault</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      Connected
                    </div>
                  </div>
                </div>

                {/* Clickable Shortened Address */}
                <button 
                  onClick={handleCopy}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-white/5 hover:border-brand/30 transition-all group"
                >
                  <span className="font-mono text-xs text-slate-400 group-hover:text-brand-light transition-colors">
                    {truncatedAddress}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-400 transition-colors uppercase tracking-tighter">Copy</span>
                    {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-500 group-hover:text-white transition-colors" />}
                  </div>
                </button>
              </div>

              {/* Balance & Status Section */}
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Encrypted Balance</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand/10 border border-brand/20 text-brand-light">
                    <Zap size={10} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Fast-Sync</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white tracking-tighter">{balance}</span>
                  <span className="text-sm font-bold text-slate-500 tracking-tight">tUSD</span>
                </div>
                
                {isVerified && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 px-3 py-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 tracking-wider">
                    <ShieldCheck size={14} />
                    VERIFIED HUMAN IDENTITY
                  </div>
                )}
              </div>

              {/* Action Menu */}
              <div className="p-2 bg-slate-900/60 border-t border-white/5 grid grid-cols-1 gap-1">
                <button className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all text-sm font-bold group">
                  <ExternalLink size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                  View on Explorer
                </button>
                <button 
                  onClick={onDisconnect}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-rose-500/10 text-rose-400/80 hover:text-rose-400 transition-all text-sm font-bold"
                >
                  <LogOut size={18} />
                  Disconnect Vault
                </button>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
