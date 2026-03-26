"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Heart, Target, Sparkles, UserCheck, ShieldCheck, Lock } from 'lucide-react';

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-950 font-sans text-slate-200 overflow-x-hidden selection:bg-brand/20"
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mini Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 md:px-12 py-5 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <Link href="/" className="flex items-center gap-3 group active:scale-95 transition-transform">
            <div className="bg-brand p-1.5 rounded-xl group-hover:bg-brand-light transition-colors shadow-lg shadow-brand/20">
              <Shield className="text-white" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter">TuliaPay</span>
          </Link>
          <Link 
            href="/dashboard"
            className="bg-white text-slate-950 px-8 py-2.5 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl"
          >
            Connect Wallet
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-24 px-6 md:px-12 space-y-32">
        {/* About Hero */}
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 text-slate-500 font-black text-sm hover:text-brand-light transition-all mb-8 group uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
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
        </div>

        {/* Vision & Mission Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div 
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 glass-panel space-y-8 relative overflow-hidden group bg-slate-900/40 border-white/5"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-colors"></div>
            <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border border-white/5 shadow-inner flex items-center justify-center">
              <Heart size={40} className="text-rose-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight text-white leading-none">Global Inclusion</h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                TuliaPay is built on the core belief that secure, borderless payments should be accessible to all humans, regardless of location or economic background.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 glass-panel space-y-8 relative overflow-hidden group bg-slate-900/40 border-white/5"
          >
             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-colors"></div>
            <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border border-white/5 shadow-inner flex items-center justify-center">
              <Target size={40} className="text-emerald-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight text-white leading-none">Privacy Scale</h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                We bridge the gap between complex cryptography and human simplicity, making FHE (Fully Homomorphic Encryption) powerful yet effortless to use.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Value Grid */}
        <div className="max-w-7xl mx-auto space-y-20 py-20 relative text-center">
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
              <motion.div 
                key={i} 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 rounded-[2.5rem] border border-white/5 bg-slate-900/60 hover:border-brand/30 hover:bg-slate-900 transition-all space-y-6 group"
              >
                <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <v.icon size={32} className="text-brand-light" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">{v.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="bg-gradient-to-br from-brand via-brand/90 to-brand-light p-16 md:p-24 rounded-[4rem] text-center space-y-10 relative overflow-hidden shadow-3xl shadow-brand/30 group">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-700"></div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
              Join the private capital <br /> revolution today.
            </h2>
            <div className="flex justify-center flex-col sm:flex-row gap-6 pt-4">
              <Link 
                href="/dashboard"
                className="bg-white text-brand px-12 py-6 rounded-[2.5rem] font-black text-3xl hover:scale-105 transition-all shadow-3xl flex items-center gap-4 active:scale-95"
              >
                <Lock size={32} /> Launch vault
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 md:px-12 text-slate-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Shield className="text-brand-light" size={28} />
            </div>
            <span className="font-black text-2xl text-white leading-none tracking-tighter font-sans">TuliaPay</span>
          </div>
          <p className="text-slate-600 text-xs font-black uppercase tracking-[0.3em]">&copy; 2026 TuliaPay Protocol. Human Exclusive.</p>
        </div>
      </footer>
    </motion.div>
  );
}
