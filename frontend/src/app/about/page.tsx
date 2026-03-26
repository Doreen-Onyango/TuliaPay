"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Heart, Target, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Mini Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 md:px-12 py-4 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-brand p-1.5 rounded-lg group-hover:bg-slate-900 transition-colors">
              <Shield className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">TuliaPay</span>
          </Link>
          <Link 
            href="/dashboard"
            className="bg-brand text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition shadow-lg shadow-brand/10"
          >
            Connect Wallet
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-12 space-y-32">
        {/* About Hero */}
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-brand transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
              Ensuring <span className="text-brand">financial privacy</span> for everyone.
            </h1>
            <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
              Our mission is to create a digital payment ecosystem where privacy isn&apos;t a premium feature, but a fundamental human right.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="p-12 md:p-20 bg-slate-50 rounded-[3rem] space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-colors"></div>
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center">
              <Heart size={36} className="text-rose-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Financial Inclusion</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                TuliaPay is built on the belief that secure, borderless payments should be accessible to all humans, regardless of geographical or socio-economic constraints.
              </p>
            </div>
          </div>
          <div className="p-12 md:p-20 bg-slate-900 rounded-[3rem] space-y-8 relative overflow-hidden group">
             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-400/5 rounded-full blur-2xl group-hover:bg-emerald-400/10 transition-colors"></div>
            <div className="w-16 h-16 bg-white/5 rounded-3xl shadow-sm border border-white/10 flex items-center justify-center backdrop-blur-md">
              <Target size={36} className="text-emerald-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white">Our Mission</h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                We bridge the gap between institutional-grade cryptography and end-user simplicity, ensuring that FHE remains powerful yet effortless to use.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto space-y-16 py-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Our Core Values</h2>
            <p className="text-slate-500 text-xl font-medium">Building with trust, integrity, and absolute encryption.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Zero-Knowledge Logic", desc: "No plaintext balance exposure. Not even the miners can see what's in your vault." },
              { icon: UserCheck, title: "Human Specific-Only", desc: "Direct integration with World ID ensures that bots and Sybils cannot infiltrate our ecosystem." },
              { icon: Sparkles, title: "Modern Simplicity", desc: "Complex mathematical encryption wrapped in an intuitive, premium user experience." }
            ].map((v, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:shadow-2xl hover:shadow-slate-100 transition-all space-y-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                  <v.icon size={28} className="text-brand" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Overlay */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-brand p-12 md:p-20 rounded-[4rem] text-center space-y-8 relative overflow-hidden shadow-2xl shadow-brand/20">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[100px]"></div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Join the revolution of <br /> confidential capital.
            </h2>
            <div className="flex justify-center">
              <Link 
                href="/dashboard"
                className="bg-white text-brand px-12 py-6 rounded-[2rem] font-black text-2xl hover:scale-105 transition shadow-2xl flex items-center gap-3 active:scale-95"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Same as Home) */}
      <footer className="pt-20 pb-10 px-6 md:px-12 text-slate-600 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Shield className="text-brand" size={24} />
            <span className="font-bold text-xl text-slate-900 leading-none">TuliaPay</span>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">&copy; 2026 TuliaPay Protocol. Built for all humans.</p>
        </div>
      </footer>
    </div>
  );
}
