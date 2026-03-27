"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero/Hero'
import { Benefits } from '../components/sections/Benefits/Benefits'
import { HowItWorks } from '../components/sections/HowItWorks/HowItWorks'
import { CTA } from '../components/sections/CTA/CTA'

export default function LandingPage() {
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Shield, Send, ArrowDownToLine, Eye, EyeOff, Activity, Wallet, BotOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { 
  walletAddressAtom, 
  isVerifiedHumanAtom, 
  encryptedBalanceAtom, 
  activeTabAtom,
  globalMetricsAtom,
  transactionStatusAtom,
  transactionMessageAtom
} from '../store';
import { WorldIDVerifyButton } from "./world-idkit-client";

export default function TuliaPayDashboard() {
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [isVerified, setIsVerified] = useAtom(isVerifiedHumanAtom);
  const [balance, setBalance] = useAtom(encryptedBalanceAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [metrics] = useAtom(globalMetricsAtom);
  const [txStatus, setTxStatus] = useAtom(transactionStatusAtom);
  const [txMessage, setTxMessage] = useAtom(transactionMessageAtom);

  const [depositAmount, setDepositAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const handleConnect = () => setWalletAddress("0x7F5...3aB9");
  
  const handleToggleBalance = () => {
    setBalance(balance === "****" ? "1,240.50" : "****");
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxStatus("processing");
    setTxMessage("Generating local FHE proof...");
    
    // Simulate FHE Encryption overhead
    await new Promise(r => setTimeout(r, 1500));
    setTxMessage("Relaying encrypted payload to fhEVM...");
    
    await new Promise(r => setTimeout(r, 2000));
    setTxStatus("success");
    setTxMessage(`Successfully deposited ${depositAmount} tUSD into vault.`);
    setDepositAmount("");
    setTimeout(() => { setTxStatus("idle"); setActiveTab("dashboard"); }, 3000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxStatus("processing");
    setTxMessage("Encrypting outbound payload...");
    
    await new Promise(r => setTimeout(r, 2000));
    setTxMessage("Submitting blind transfer to relayer...");
    
    await new Promise(r => setTimeout(r, 2500));
    setTxStatus("success");
    setTxMessage(`Securely sent ${sendAmount} tUSD to ${recipient.slice(0,6)}...`);
    setSendAmount("");
    setRecipient("");
    setTimeout(() => { setTxStatus("idle"); setActiveTab("dashboard"); }, 3000);
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 space-y-8 bg-slate-950">
        <div className="p-4 bg-brand rounded-full shadow-lg shadow-brand/40 animate-pulse">
          <Shield size={64} className="text-white" />
        </div>
        <div className="space-y-4 max-w-md">
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-light to-emerald-400 tracking-tighter">
            TuliaPay
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Confidential on-chain payments. Built for humans, secured by FHE.
          </p>
        </div>
        <button 
          onClick={handleConnect}
          className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-950">
        <div className="glass-panel p-12 flex flex-col items-center text-center space-y-8 max-w-xl w-full border-brand/20">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center shadow-inner border border-slate-800">
            <BotOff size={40} className="text-brand-light" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white">Bot Protection</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              To maintain the integrity of our private ecosystem, all users must verify 
              humanity via World ID before accessing the encrypted vault.
            </p>
          </div>
          <WorldIDVerifyButton />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-slate-950 font-sans selection:bg-brand/20 selection:text-brand-light text-slate-200 overflow-x-hidden relative"
    >
      {/* Global Glows */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-30 z-50"></div>
      
      <Navbar />
      
      <main>
        <Hero />
        <Benefits />
        <div className="relative">
           <div className="absolute top-1/2 left-0 w-full h-[600px] bg-brand/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
           <HowItWorks />
        </div>
        <CTA />
      </main>

      <Footer />
    </motion.div>
  )
}
