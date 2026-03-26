"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '../../ui/Button'

interface TransactionData {
  amount: string
  recipient?: string
}

interface TransactionFormProps {
  type: 'deposit' | 'send'
  onBack: () => void
  onSubmit: (data: TransactionData) => Promise<void>
}

export const TransactionForm = ({ type, onBack, onSubmit }: TransactionFormProps) => {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ amount, recipient })
    setAmount("")
    setRecipient("")
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-xl mx-auto space-y-10"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-4 bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-all shadow-inner border border-white/5"
        >
          <ArrowLeft size={32} />
        </button>
        <h2 className="text-5xl font-black capitalize text-white">{type}</h2>
      </div>

      <div className="glass-panel p-12 space-y-10 border-brand/20 shadow-2xl rounded-[3rem]">
        <form onSubmit={handleSubmit} className="space-y-10">
          {type === 'send' && (
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Recipient Address</label>
              <input 
                type="text"
                className="w-full bg-slate-950/50 border border-white/5 p-6 rounded-2xl text-white font-mono placeholder:text-slate-800 focus:outline-none focus:border-brand/40 transition-colors"
                placeholder="0x..."
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Amount (tUSD)</label>
            <div className="relative">
              <input 
                type="number"
                className="w-full bg-slate-950/50 border border-white/5 p-10 rounded-3xl text-6xl font-black text-white focus:outline-none focus:border-brand/40 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-slate-700 text-3xl">tUSD</div>
            </div>
          </div>

          <div className="p-8 bg-brand/5 rounded-3xl border border-brand/20 flex gap-5">
            <Shield className="text-brand shrink-0" size={32} />
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              This operation is secured by **fhEVM**. Your data is never decrypted during computation.
            </p>
          </div>

          <Button variant="white" size="xl" fullWidth type="submit">
            {type === 'deposit' ? "Sign Deposit" : "Confirm Send"}
          </Button>
        </form>
      </div>
    </motion.div>
  )
}

export const TransactionOverlay = ({ status, message }: { status: string, message: string }) => (
  <AnimatePresence>
    {status !== "idle" && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass-panel p-10 max-w-sm w-full text-center space-y-6 border-brand/30 shadow-2xl shadow-brand/10 rounded-[2.5rem]"
        >
          {status === "processing" && <Loader2 size={64} className="animate-spin text-brand mx-auto" />}
          {status === "success" && <CheckCircle2 size={64} className="text-emerald-400 mx-auto" />}
          {status === "error" && <XCircle size={64} className="text-rose-400 mx-auto" />}
          <div className="space-y-2">
            <h4 className="text-2xl font-black capitalize text-white">{status}</h4>
            <p className="text-slate-400 font-medium">{message}</p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)
