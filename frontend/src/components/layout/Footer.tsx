import React from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Container } from '../ui/LayoutUtils'

export const Footer = () => {
  return (
    <footer className="pt-24 pb-12 text-slate-500 border-t border-white/5 bg-slate-950">
      <Container className="space-y-16">
        <div className="flex flex-col md:flex-row justify-between gap-16">
          <div className="space-y-8 max-w-xs text-center md:text-left">
            <Link href="/" className="flex items-center gap-3 justify-center md:justify-start group">
              <div className="bg-slate-900 p-2 rounded-xl border border-white/5 group-hover:bg-slate-800 transition-colors">
                <Shield className="text-brand-light" size={28} />
              </div>
              <span className="font-black text-2xl text-white leading-none tracking-tighter">TuliaPay</span>
            </Link>
            <p className="text-slate-400 leading-relaxed font-medium">
              Designing the future of confidential on-chain finance. Built by humans, for humans.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:gap-24 text-left">
            <div className="space-y-6">
              <h4 className="font-black text-white uppercase tracking-widest text-xs">Protocol</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link href="/#how-it-works" className="hover:text-brand-light transition-colors">How it Works</Link></li>
                <li><Link href="/about" className="hover:text-brand-light transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-black text-white uppercase tracking-widest text-xs">Community</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link href="#" className="hover:text-brand-light transition-colors">Twitter (X)</Link></li>
                <li><Link href="#" className="hover:text-brand-light transition-colors">Docs</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-slate-600 text-xs font-black uppercase tracking-[0.3em]">&copy; 2026 TuliaPay Protocol. Human Exclusive.</p>
        </div>
      </Container>
    </footer>
  )
}
