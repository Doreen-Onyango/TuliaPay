"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserCheck } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Container, Section } from '../../ui/LayoutUtils'

export const CTA = () => {
  return (
    <Section padding="lg">
      <Container>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden p-16 md:p-24 bg-gradient-to-br from-brand via-brand/90 to-brand-light rounded-[3.5rem] text-center space-y-10 shadow-3xl shadow-brand/30"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[100px]"></div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
            Start using private <br className="hidden md:block" /> payments today.
          </h2>
          <p className="text-white/80 text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Join the thousands of humans already protecting their financial privacy with TuliaPay. 
          </p>
          <div className="flex justify-center pt-4">
            <Link href="/dashboard">
              <Button variant="white" size="2xl" icon={UserCheck}>
                Connect Wallet
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
