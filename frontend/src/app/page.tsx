"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Send, ArrowDownToLine, Menu, X, ArrowRight, Wallet, Lock, UserCheck } from 'lucide-react';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link 
    href={href} 
    className="text-slate-400 hover:text-brand-light transition-colors font-bold text-sm md:text-base"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-brand/20 selection:text-brand-light text-slate-200">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 md:px-12 py-5 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-brand p-1.5 rounded-xl shadow-lg shadow-brand/20">
              <Shield className="text-white" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">TuliaPay</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="/about">About</NavLink>
            <Link 
              href="/dashboard"
              className="bg-white text-slate-950 px-7 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Connect Wallet
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-950 border-b border-white/5 p-8 flex flex-col gap-8 animate-slide-down shadow-2xl">
            <NavLink href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</NavLink>
            <NavLink href="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <Link 
              href="/dashboard"
              className="bg-brand text-white px-6 py-5 rounded-2xl text-center font-black text-xl shadow-lg shadow-brand/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Connect Wallet
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-10 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand-light px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-fade-in border border-brand/20">
              <Lock size={14} /> Confidential Payments
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter animate-slide-up">
              Banking for <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-light to-emerald-400">humans</span>.
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
              Send, receive, and store assets privately using end-to-end encryption. 
              Verified by World ID, secured by FHE.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-5 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link 
                href="/dashboard"
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-[1.25rem] font-black text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 active:scale-95"
              >
                Launch App <ArrowRight size={24} />
              </Link>
              <Link 
                href="#how-it-works"
                className="w-full sm:w-auto px-10 py-5 bg-slate-900/50 text-slate-300 backdrop-blur-md border border-white/10 rounded-[1.25rem] font-black text-xl hover:bg-slate-800 transition-all"
              >
                Experience FHE
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl lg:max-w-none animate-fade-in relative" style={{animationDelay: '0.3s'}}>
            <div className="relative group p-4">
              {/* Animated rings around the image */}
              <div className="absolute inset-0 border-[2px] border-brand/20 rounded-[3rem] animate-[spin_20s_linear_infinite] opacity-50"></div>
              <div className="absolute inset-4 border-[1px] border-emerald-500/10 rounded-[2.5rem] animate-[spin_15s_linear_infinite_reverse] opacity-30"></div>
              
              <Image 
                src="/tuliapay_hero_illustration_1774560012997.png" 
                alt="TuliaPay Secure Illustration" 
                width={800} 
                height={800}
                className="relative rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 transition-transform duration-700 hover:scale-[1.02] grayscale-[0.2] contrast-[1.1]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Simple. Secure. Private.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
              TuliaPay streamlines encrypted finance into four simple steps while maintaining institutional-grade security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Wallet, title: "Connect", desc: "Link your Web3 wallet to Tulia's high-speed private vault." },
              { icon: ArrowDownToLine, title: "Deposit", desc: "Add funds into your private account securely using native assets." },
              { icon: Lock, title: "Encrypt", desc: "Zama FHE ensures only you see your true balance on-chain." },
              { icon: Send, title: "Transfer", desc: "Send assets privately to any verified human with total anonymity." }
            ].map((step, i) => (
              <div key={i} className="glass-panel group p-10 hover:border-brand/40 transition-all border-white/5 bg-slate-900/40">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-brand/30 transition-all shadow-inner">
                  <step.icon size={32} className="text-brand-light" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{i+1}. {step.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden p-16 md:p-24 bg-gradient-to-br from-brand via-brand/90 to-brand-light rounded-[3.5rem] text-center space-y-10 shadow-3xl shadow-brand/30">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-400 opacity-10 rounded-full blur-[100px]"></div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              Start using private <br className="hidden md:block" /> payments today.
            </h2>
            <p className="text-white/80 text-xl font-medium max-w-xl mx-auto leading-relaxed">
              Join the thousands of humans already protecting their financial privacy with TuliaPay. 
            </p>
            <div className="flex justify-center pt-4">
              <Link 
                href="/dashboard"
                className="bg-white text-brand px-12 py-6 rounded-[2rem] font-black text-2xl hover:scale-105 transition-all shadow-2xl flex items-center gap-4 active:scale-95 group"
              >
                <UserCheck size={32} className="group-hover:scale-110 transition-transform" /> Connect Wallet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 md:px-12 text-slate-500 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between gap-16">
            <div className="space-y-8 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2 rounded-xl border border-white/5">
                  <Shield className="text-brand-light" size={28} />
                </div>
                <span className="font-black text-2xl text-white leading-none tracking-tighter">TuliaPay</span>
              </div>
              <p className="text-slate-400 leading-relaxed font-medium">
                Designing the future of confidential on-chain finance. Built by humans, for humans.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-24">
              <div className="space-y-6">
                <h4 className="font-black text-white uppercase tracking-widest text-xs">Protocol</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li><NavLink href="#how-it-works">How it Works</NavLink></li>
                  <li><NavLink href="/about">About Us</NavLink></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="font-black text-white uppercase tracking-widest text-xs">Community</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li><NavLink href="#">Twitter (X)</NavLink></li>
                  <li><NavLink href="#">Docs</NavLink></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            <p>&copy; 2026 TuliaPay Protocol. All humans reserved.</p>
            <div className="flex gap-10">
              <span className="hover:text-brand-light cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-brand-light cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-brand-light cursor-pointer transition-colors">System Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
