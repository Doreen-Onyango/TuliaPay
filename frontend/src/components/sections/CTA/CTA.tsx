"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserCheck, LayoutDashboard, ArrowRight } from 'lucide-react'
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
          className="relative overflow-hidden p-12 md:p-24 bg-gradient-to-br from-brand via-brand/90 to-brand-light rounded-[3rem] md:rounded-[4rem] text-center space-y-10 shadow-3xl shadow-brand/30"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[100px]"></div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              {walletAddress ? (
                <>Your private vault <br className="hidden md:block" /> is ready.</>
              ) : (
                <>Start using private <br className="hidden md:block" /> payments today.</>
              )}
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
              {walletAddress 
                ? "You're all set to manage your encrypted assets with institutional-grade privacy."
                : "Join the thousands of humans already protecting their financial privacy with TuliaPay."
              }
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button 
                variant="white" 
                size="2xl" 
                icon={walletAddress ? LayoutDashboard : UserCheck}
                fullWidth
              >
                {walletAddress ? "Open Dashboard" : "Connect Wallet"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
