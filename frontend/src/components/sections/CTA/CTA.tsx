"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserCheck, LayoutDashboard } from 'lucide-react'
import { useAtom } from 'jotai'
import { walletAddressAtom } from '../../../store'
import { Button } from '../../ui/Button'
import { Container, Section } from '../../ui/LayoutUtils'

export const CTA = () => {
  const [walletAddress] = useAtom(walletAddressAtom)

  return (
    <Section padding="lg">
      <Container>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden p-8 sm:p-12 md:p-24 bg-gradient-to-br from-brand via-brand/90 to-slate-900 rounded-[2.5rem] md:rounded-[4rem] text-center space-y-10 shadow-3xl shadow-brand/30 border border-white/10"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-light/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
          
          <div className="space-y-6 relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              {walletAddress ? (
                <>Your private vault <br className="hidden md:block" /> is ready to go.</>
              ) : (
                <>Start using private <br className="hidden md:block" /> payments today.</>
              )}
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
              {walletAddress 
                ? "You're all set to manage your encrypted assets with institutional-grade privacy and speed."
                : "Join the next generation of financial privacy. Secured by Zama and verified by humans."
              }
            </p>
          </div>

          <div className="flex justify-center pt-4 relative z-10">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button 
                variant="white" 
                size="2xl" 
                icon={walletAddress ? LayoutDashboard : UserCheck}
                fullWidth
                className="shadow-2xl hover:scale-[1.05]"
              >
                {walletAddress ? "Open Dashboard" : "Get Started Now"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
