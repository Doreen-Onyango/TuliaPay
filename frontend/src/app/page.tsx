"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Send, ArrowDownToLine, Menu, X, ArrowRight, Wallet, Lock, UserCheck } from 'lucide-react';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link 
    href={href} 
    className="text-slate-600 hover:text-brand transition-colors font-medium text-sm md:text-base"
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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand/10 selection:text-brand">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 md:px-12 py-4 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-brand p-1.5 rounded-lg">
              <Shield className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">TuliaPay</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="/about">About</NavLink>
            <Link 
              href="/dashboard"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand transition-colors shadow-lg shadow-slate-900/10"
            >
              Connect Wallet
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-6 animate-slide-down">
            <NavLink href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</NavLink>
            <NavLink href="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <Link 
              href="/dashboard"
              className="bg-slate-900 text-white px-6 py-4 rounded-xl text-center font-bold text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Connect Wallet
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-fade-in">
              <Lock size={12} /> Confidential Payments
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tighter animate-slide-up">
              Confidential banking for <span className="text-brand">humans</span>.
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-xl animate-slide-up" style={{animationDelay: '0.1s'}}>
              Send, receive, and store assets privately using end-to-end encryption. 
              Verified by World ID, secured by FHE.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link 
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-brand text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition shadow-xl shadow-brand/20 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link 
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-100 transition"
              >
                How it works
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg md:max-w-none animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-brand/5 rounded-[2.5rem] blur-2xl group-hover:bg-brand/10 transition-colors"></div>
              <Image 
                src="/tuliapay_hero_illustration_1774560012997.png" 
                alt="TuliaPay Secure Illustration" 
                width={800} 
                height={800}
                className="relative rounded-[2rem] shadow-2xl shadow-slate-200 border border-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white px-6 md:px-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Simple. Secure. Private.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              TuliaPay streamlines encrypted finance into four simple steps while maintaining absolute institutional security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Wallet, title: "Connect", desc: "Link your Web3 wallet to Tulia's high-speed vault." },
              { icon: ArrowDownToLine, title: "Deposit", desc: "Add funds into your private account securely." },
              { icon: Lock, title: "Encrypt", desc: "Zama FHE ensures only you see your true balance." },
              { icon: Send, title: "Transfer", desc: "Send assets privately to any verified human." }
            ].map((step, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon size={28} className="text-brand" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{i+1}. {step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden p-12 md:p-20 bg-slate-900 rounded-[3rem] text-center space-y-8 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand opacity-10 rounded-full blur-[100px]"></div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none">
              Start using private <br className="hidden md:block" /> payments today.
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Join thousands of humans already protecting their financial privacy with TuliaPay. 
            </p>
            <div className="flex justify-center">
              <Link 
                href="/dashboard"
                className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition shadow-2xl flex items-center gap-3"
              >
                <UserCheck size={28} /> Connect Wallet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 px-6 md:px-12 text-slate-600 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-6 max-w-xs">
              <div className="flex items-center gap-2">
                <Shield className="text-brand" size={24} />
                <span className="font-bold text-xl text-slate-900 leading-none">TuliaPay</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                Designing the future of confidential on-chain finance. Only for humans.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Resources</h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li><NavLink href="#how-it-works">How it Works</NavLink></li>
                  <li><NavLink href="/about">About Us</NavLink></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Support</h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li><NavLink href="#">Twitter (X)</NavLink></li>
                  <li><NavLink href="#">Documentation</NavLink></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-100 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
            <p>&copy; 2026 TuliaPay Protocol. All humans reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-brand cursor-pointer">Privacy Policy</span>
              <span className="hover:text-brand cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
