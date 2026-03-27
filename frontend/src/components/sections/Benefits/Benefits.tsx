"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, EyeOff, Zap, UserCheck, Smartphone, Search } from 'lucide-react'
import { Container, Section } from '../../ui/LayoutUtils'

const benefits = [
  {
    icon: EyeOff,
    title: "On-chain Privacy",
    desc: "Your transaction history and balances remain encrypted even from the network nodes using Zama FHE technology."
  },
  {
    icon: UserCheck,
    title: "Real Humans Only",
    desc: "Every account is verified by World ID, preventing bots and ensuring you're only paying real people."
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    desc: "Private doesn't mean slow. TuliaPay delivers sub-second confirmation on our L2 optimized for data privacy."
  },
  {
    icon: Shield,
    title: "Self-Custodial",
    desc: "TuliaPay never touches your keys. Your funds are always in your control, secured by institutional encryption."
  },
  {
    icon: Smartphone,
    title: "Mobile Native",
    desc: "The only private payment layer built for a mobile-first world. Seamless Apple Pay and Google Pay integration coming soon."
  },
  {
    icon: Search,
    title: "Full Auditability",
    desc: "Generate zero-knowledge reports for compliance without revealing your full decrypted history."
  }
]

export const Benefits = () => {
  return (
    <Section padding="lg" className="bg-slate-950/50">
      <Container className="space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Everything you need <br /> <span className="text-brand-light">to pay privately.</span></h2>
          <p className="text-slate-400 text-xl font-medium">TuliaPay combines the transparency of the blockchain with the privacy of cash.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-8 group hover:border-brand/30 transition-all duration-500 rounded-2xl md:rounded-[1.75rem]"
            >
              <div className="w-14 h-14 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-center mb-6 group-hover:bg-brand/10 transition-colors">
                <benefit.icon className="text-brand-light group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{benefit.title}</h3>
              <p className="text-slate-300 leading-relaxed font-medium">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
