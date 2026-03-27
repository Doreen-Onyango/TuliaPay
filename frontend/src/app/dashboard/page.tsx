"use client"

import React from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Shield, 
  ArrowLeft
} from 'lucide-react';
import { 
  walletAddressAtom, 
  isVerifiedHumanAtom, 
  encryptedBalanceAtom, 
  activeTabAtom,
  globalMetricsAtom,
  transactionStatusAtom,
  transactionMessageAtom
} from '../../store';

// Modular Components
import { Button } from '../../components/ui/Button';
import { WalletDropdown } from '../../components/sections/Dashboard/WalletDropdown';
import { BalanceCard } from '../../components/sections/Dashboard/BalanceCard';
import { TransactionForm, TransactionOverlay } from '../../components/sections/Dashboard/TransactionForm';
import { MetricsGrid } from '../../components/sections/Dashboard/MetricsGrid';

import { Verification } from '../../components/sections/Dashboard/Verification';

export default function TuliaPayDashboard() {
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [isVerified, setIsVerified] = useAtom(isVerifiedHumanAtom);
  const [balance, setBalance] = useAtom(encryptedBalanceAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [metrics] = useAtom(globalMetricsAtom);
  const [txStatus, setTxStatus] = useAtom(transactionStatusAtom);
  const [txMessage, setTxMessage] = useAtom(transactionMessageAtom);

  const handleConnect = () => setWalletAddress("0x7F5A4bD2d78B9c4E9F1A3B8C7D6E5F4A3B2aC9");
  const handleWorldIDVerify = () => setIsVerified(true);
  const handleDisconnect = () => {
    setWalletAddress(null);
    setIsVerified(false);
  };
  
  const handleToggleBalance = () => {
    setBalance(balance === "****" ? "1,240.50" : "****");
  };

  const handleTransactionSubmit = async (data: { amount: string, recipient?: string }) => {
    setTxStatus("processing");
    setTxMessage(activeTab === "deposit" ? "Generating local FHE proof..." : "Encrypting outbound payload...");
    await new Promise(r => setTimeout(r, 2000));
    setTxMessage("Relaying encrypted payload to fhEVM...");
    await new Promise(r => setTimeout(r, 2500));
    setTxStatus("success");
    setTxMessage(activeTab === "deposit" 
        ? `Successfully deposited ${data.amount} tUSD into vault.`
        : `Securely sent ${data.amount} tUSD to recipient.`
    );
    setTimeout(() => { setTxStatus("idle"); setActiveTab("dashboard"); }, 3000);
  };

  if (!walletAddress) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center p-6 space-y-8 bg-slate-950"
      >
        <div className="p-5 bg-brand/10 border border-brand/30 rounded-2xl shadow-lg shadow-brand/10">
          <Shield size={56} className="text-brand-light" />
        </div>
        <div className="space-y-4 max-w-md">
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-light tracking-tighter">
            TuliaPay
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Your connection has timed out. Please reconnect to access your private vault.
          </p>
        </div>
        <Button variant="white" size="xl" onClick={handleConnect}>
          Reconnect Wallet
        </Button>
        <Link href="/" className="text-slate-500 hover:text-white transition-colors font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Homepage
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-20 bg-slate-950 text-slate-200"
    >
      {/* Top Navbar */}
      <nav className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-b border-white/5 py-4 px-6 md:px-10 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl !overflow-visible">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform">
          <div className="bg-brand p-1.5 rounded-lg shadow-lg shadow-brand/20 group-hover:bg-brand-light transition-colors">
            <Shield className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">
            <span className="text-brand">Tulia</span>Pay
          </span>
        </Link>
        
        <div className="flex items-center gap-6 font-bold">
          {isVerified && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 text-sm">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              Human Verified
            </div>
          )}
          
          <WalletDropdown address={walletAddress} onDisconnect={handleDisconnect} />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto mt-12 md:mt-20 p-6 md:p-10 space-y-12 md:space-y-20">
        <TransactionOverlay status={txStatus} message={txMessage} />

        {!isVerified ? (
           <Verification onVerify={handleWorldIDVerify} />
        ) : (
          <div className="space-y-12">
            {activeTab === "dashboard" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <BalanceCard balance={balance} onToggle={handleToggleBalance} onAction={setActiveTab} />
                <MetricsGrid metrics={metrics} />
              </motion.div>
            )}

            {(activeTab === "deposit" || activeTab === "send") && (
              <TransactionForm 
                type={activeTab} 
                onBack={() => setActiveTab("dashboard")} 
                onSubmit={handleTransactionSubmit} 
              />
            )}
          </div>
        )}
      </main>
    </motion.div>
  );
}
