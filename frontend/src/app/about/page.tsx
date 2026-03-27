"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Target, Sparkles, UserCheck, ShieldCheck, Lock } from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { Button } from '../../components/ui/Button'
import { Container, Section } from '../../components/ui/LayoutUtils'

interface ValueCardProps {
    icon: React.ElementType
    title: string
    desc: string
    index: number
}

const ValueCard = ({ icon: Icon, title, desc, index }: ValueCardProps) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-brand/30 hover:bg-slate-900/60 transition-all duration-300 space-y-5 group"
  >
    <div className="w-14 h-14 bg-slate-900 rounded-xl border border-white/5 shadow-inner flex items-center justify-center group-hover:border-brand/30 group-hover:bg-brand/10 transition-all">
      <Icon size={22} className="text-brand-light group-hover:scale-110 transition-transform" />
    </div>
    <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium text-sm">
      {desc}
    </p>
  </motion.div>
)

export default function AboutPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-950 font-sans text-slate-200 overflow-x-hidden selection:bg-brand/20"
    >
      <Navbar />

      <main>
        {/* About Hero */}
        <Section className="pt-40">
           <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[140px] pointer-events-none"></div>
           <Container className="text-center space-y-10">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                  Financial <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-light to-emerald-400">privacy</span> for all.
                </h1>
                <p className="text-xl md:text-3xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
                  Our mission is to build a digital financial network where privacy isn&apos;t an option, but a standard fundamental right.
                </p>
              </motion.div>
           </Container>
        </Section>

        {/* Vision & Mission Cards */}
        <Section padding="md">
          <Container className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="glass-panel p-10 md:p-14 space-y-6 relative overflow-hidden group bg-slate-900/40 border border-white/5 hover:border-brand/30 hover:bg-slate-900/60 transition-all duration-300 rounded-2xl"
            >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-colors"></div>
                <div className="w-14 h-14 bg-slate-900 rounded-xl border border-white/5 shadow-inner flex items-center justify-center group-hover:border-brand/30 group-hover:bg-brand/10 transition-all">
                <Heart size={22} className="text-rose-400" />
                </div>
                <div className="space-y-3">
                <h2 className="text-2xl font-black tracking-tight text-white leading-none">Global Inclusion</h2>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    TuliaPay is built on the core belief that secure, borderless payments should be accessible to all humans, regardless of location or economic background.
                </p>
                </div>
            </motion.div>
            <motion.div 
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="glass-panel p-10 md:p-14 space-y-6 relative overflow-hidden group bg-slate-900/40 border border-white/5 hover:border-brand/30 hover:bg-slate-900/60 transition-all duration-300 rounded-2xl"
            >
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-colors"></div>
                <div className="w-14 h-14 bg-slate-900 rounded-xl border border-white/5 shadow-inner flex items-center justify-center group-hover:border-brand/30 group-hover:bg-brand/10 transition-all">
                <Target size={22} className="text-emerald-400" />
                </div>
                <div className="space-y-3">
                <h2 className="text-2xl font-black tracking-tight text-white leading-none">Privacy Scale</h2>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    We bridge the gap between complex cryptography and human simplicity, making FHE (Fully Homomorphic Encryption) powerful yet effortless to use.
                </p>
                </div>
            </motion.div>
          </Container>
        </Section>

        {/* Value Grid */}
        <Section padding="lg">
           <Container className="space-y-20 relative text-center">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Our Values</h2>
                <p className="text-slate-400 text-2xl font-medium tracking-tight">Trust, integrity, and absolute encryption by default.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                  { icon: ShieldCheck, title: "ZAMA Layered", desc: "No plaintext balance exposure. Your finances are encrypted from the moment they enter Tulia." },
                  { icon: UserCheck, title: "Verified Humans", desc: "Integration with World ID prevents bots and Sybil attacks while maintaining total anonymity." },
                  { icon: Sparkles, title: "Modern Design", desc: "Complex mathematical operations wrapped in an intuitive, premium interface designed for speed." }
                ].map((v, i) => (
                  <ValueCard key={i} {...v} index={i} />
                ))}
              </div>
           </Container>
        </Section>

        {/* CTA Banner */}
        <Section padding="lg">
          <Container>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-brand via-brand/90 to-brand-light p-16 md:p-24 rounded-[4rem] text-center space-y-10 relative overflow-hidden shadow-3xl shadow-brand/30 group"
            >
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-700"></div>
                <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                Join the private capital <br /> revolution today.
                </h2>
                <div className="flex justify-center flex-col sm:flex-row gap-6 pt-4">
                    <Button variant="white" size="2xl" icon={Lock} onClick={() => window.location.href='/dashboard'}>
                        Launch vault
                    </Button>
                </div>
            </motion.div>
          </Container>
        </Section>
      </main>

      <Footer />
    </motion.div>
  )
}
