"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAtom } from 'jotai'
import { Shield, Menu, X, ArrowRight } from 'lucide-react'
import { walletAddressAtom, isVerifiedHumanAtom } from '../../store'
import { Button } from '../ui/Button'
import { Container } from '../ui/LayoutUtils'
import { WalletDropdown } from '../sections/Dashboard/WalletDropdown'

export const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link 
    href={href} 
    className="text-slate-300 hover:text-brand-light transition-colors font-bold text-sm md:text-base tracking-tight"
    onClick={onClick}
  >
    {children}
  </Link>
)

interface NavbarProps {
  variant?: 'landing' | 'dashboard'
  onDisconnect?: () => void
}

export const Navbar = ({ variant = 'landing', onDisconnect }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [walletAddress] = useAtom(walletAddressAtom)
  const [isVerified] = useAtom(isVerifiedHumanAtom)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    if (variant === 'landing') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [variant])

  const isDashboard = variant === 'dashboard'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-4 ${
      isDashboard || isScrolled 
        ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
        : 'bg-transparent'
    }`}>
      <Container 
        maxWidth={isDashboard ? '5xl' : '7xl'} 
        className={`flex justify-between items-center ${isDashboard ? 'px-6 md:px-10' : ''}`}
      >
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform group">
          <div className="bg-brand p-1.5 rounded-xl shadow-lg shadow-brand/20 group-hover:bg-brand-light transition-colors">
            <Shield className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl md:text-3xl tracking-tighter text-white">
            <span className="text-brand">Tulia</span>Pay
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 md:gap-10">
          {!isDashboard && (
            <>
              <NavLink href="/#how-it-works">How It Works</NavLink>
              <NavLink href="/about">About</NavLink>
            </>
          )}

          {isDashboard ? (
            <div className="flex items-center gap-6 font-bold">
              {isVerified && (
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 text-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  Human Verified
                </div>
              )}
              {walletAddress && <WalletDropdown address={walletAddress} onDisconnect={onDisconnect || (() => {})} />}
            </div>
          ) : (
            walletAddress ? (
              <Link href="/dashboard">
                <Button variant="secondary" size="md" icon={ArrowRight} iconRight>
                  Launch Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button variant="white" size="md">
                  Connect Wallet
                </Button>
              </Link>
            )
          )}
        </div>

        <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </Container>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-slate-950 border-b border-white/5 p-8 flex flex-col gap-8 shadow-2xl"
          >
            {!isDashboard ? (
              <>
                <NavLink href="/#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</NavLink>
                <NavLink href="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
                <Link href="/dashboard">
                    <Button variant="primary" size="lg" fullWidth>
                        {walletAddress ? "Open Dashboard" : "Connect Wallet"}
                    </Button>
                </Link>
              </>
            ) : (
              walletAddress && <WalletDropdown address={walletAddress} onDisconnect={onDisconnect || (() => {})} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
