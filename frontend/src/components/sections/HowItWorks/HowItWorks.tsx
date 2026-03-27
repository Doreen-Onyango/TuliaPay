"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Wallet, ArrowDownToLine, Lock, Send, LucideIcon } from 'lucide-react'
import { Container, Section } from '../../ui/LayoutUtils'

interface StepCardProps {
  icon: LucideIcon
  title: string
  desc: string
  index: number
}

const StepCard = ({ icon: Icon, title, desc, index }: StepCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15 }}
    className="glass-panel group p-8 md:p-10 hover:border-brand/40 transition-all border-white/5 bg-slate-900/40 rounded-2xl md:rounded-[2rem]"
  >
    <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-brand/30 transition-all shadow-inner">
      <Icon size={32} className="text-brand-light" />
    </div>
    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{index + 1}. {title}</h3>
    <p className="text-slate-300 leading-relaxed font-medium">
      {desc}
    </p>
  </motion.div>
)

export const HowItWorks = () => {
  const steps = [
    { icon: Wallet, title: "Connect", desc: "Link your Web3 wallet to Tulia's high-speed private vault." },
    { icon: ArrowDownToLine, title: "Deposit", desc: "Add funds into your private account securely using native assets." },
    { icon: Lock, title: "Encrypt", desc: "Zama FHE ensures only you see your true balance on-chain." },
    { icon: Send, title: "Transfer", desc: "Send assets privately to any verified human with total anonymity." }
  ]

  return (
    <Section id="how-it-works" padding="lg">
      <Container className="space-y-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter">Simple. Secure. Private.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            TuliaPay streamlines encrypted finance into four simple steps while maintaining institutional-grade security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10">
              <StepCard {...step} index={i} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
