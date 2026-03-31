"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, ShieldCheck, Zap, Globe, LucideIcon } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Container, Section } from '../../ui/LayoutUtils'
import { connectWallet, getTuliaProtocolContract } from '@/utils/contractConnection'

const TrustMarker = ({ icon: Icon, text }: { icon: LucideIcon, text: string }) => (
  <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest">
    <Icon size={14} className="text-brand-light" />
    {text}
  </div>
)

export const Hero = () => {
  const [wallet, setWallet] = useState<string | null>(null);
  const router = useRouter();

  const handleConnect = async () => {
    try {
      // 1. Pop open MetaMask and ask user to connect
      const { signer, address } = await connectWallet();
      setWallet(address);

      // 2. Connect to the Tulia Protocol
      const protocolContract = await getTuliaProtocolContract(signer);
      
      // 3. Test a quick read!
      const owner = await protocolContract.owner();
      console.log("Connected Successfully! 🎉");
      console.log("Contract Owner is:", owner);
      
      // Redirect to dashboard after connection
      router.push('/dashboard');

    } catch (err) {
      console.error("Connection Flow Failed:", err);
    }
  };

  return (
    <Section padding="none" className="pt-28 md:pt-40 pb-16 md:pb-24">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <Container className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        <motion.div 
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 space-y-12 text-center lg:text-left"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-brand/10 text-brand-light px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-brand/20 shadow-lg shadow-brand/5"
            >
              <div className="w-2 h-2 bg-brand-light rounded-full animate-pulse" />
              Confidential Payments Protocol
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              Banking for <br /> 
              <span className="relative inline-block mt-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-light via-emerald-400 to-brand-light bg-[length:200%_auto] animate-[gradient_4s_linear_infinite]">humans</span>.
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-light to-transparent rounded-full opacity-30" />
              </span>
            </h1>
            
            <p className="text-slate-300 text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              The first high-speed payment network powered by <span className="text-white">FHE</span>. 
              Send, receive, and store assets with total on-chain privacy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-auto">
              <Button onClick={handleConnect} variant="white" size="xl" icon={ArrowRight} iconRight fullWidth className="shadow-2xl shadow-white/10 group">
                {wallet ? `Connected: ${wallet.slice(0, 6)}...` : "Launch App"}
              </Button>
            </div>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="xl" fullWidth className="backdrop-blur-sm">
                How it Works
              </Button>
            </Link>
          </div>

          <div className="pt-10 md:pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
            <TrustMarker icon={ShieldCheck} text="Zama FHE" />
            <TrustMarker icon={Globe} text="World ID" />
            <TrustMarker icon={Zap} text="Low Gas" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "circOut" }}
          className="flex-1 w-full max-w-xl lg:max-w-none relative"
        >
          <div className="relative group">
            {/* Pulsing rings */}
            <div className="absolute inset-0 border-[2px] border-brand/20 rounded-[4rem] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
            <div className="absolute inset-0 border-[2px] border-brand/20 rounded-[4rem] animate-[spin_30s_linear_infinite] opacity-30"></div>
            
            <div className="relative glass-panel rounded-2xl md:rounded-3xl overflow-hidden border-white/10 shadow-3xl max-h-[400px] md:max-h-[600px] lg:max-h-none flex items-center justify-center">
              <Image 
                src="/tuliapay_hero_illustration_1774560012997.png" 
                alt="TuliaPay Secure Illustration" 
                width={800} 
                height={800}
                className="relative transition-transform duration-700 group-hover:scale-[1.05] contrast-[1.05] object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
