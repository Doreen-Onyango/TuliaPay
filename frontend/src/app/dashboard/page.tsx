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
import { ActiveWithdrawals } from '../../components/sections/Dashboard/ActiveWithdrawals';

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

  const [hasPendingWithdrawal, setHasPendingWithdrawal] = React.useState(false);
  const [hasClaimableETH, setHasClaimableETH] = React.useState(false);

  // Mock checking pending state when connecting
  React.useEffect(() => {
    if (walletAddress) {
      setHasPendingWithdrawal(true);
      setHasClaimableETH(true);
    }
  }, [walletAddress]);

  const handleCancelWithdrawal = async () => {
    setTxStatus("processing");
    setTxMessage("Cancelling stalled withdrawal... Executing encrypted reversal.");
    await new Promise(r => setTimeout(r, 2000));
    setTxStatus("success");
    setTxMessage("Withdrawal cancelled. Funds fully reinstated to your vault.");
    setHasPendingWithdrawal(false);
    setTimeout(() => setTxStatus("idle"), 3000);
  };

  const handleClaimETH = async () => {
    setTxStatus("processing");
    setTxMessage("Pushing trapped ETH balance into your address natively...");
    await new Promise(r => setTimeout(r, 2000));
    setTxStatus("success");
    setTxMessage("ETH securely claimed and deposited into your account.");
    setHasClaimableETH(false);
    setTimeout(() => setTxStatus("idle"), 3000);
  };

  const handleTransactionSubmit = async (data: { amount: string, recipient?: string }) => {
    setTxStatus("processing");
    setTxMessage(activeTab === "deposit" ? "Generating local FHE proof..." : "Encrypting outbound payload with nonce...");
    await new Promise(r => setTimeout(r, 2000));
    setTxMessage("Relaying encrypted payload to fhEVM...");
    await new Promise(r => setTimeout(r, 2500));
    setTxStatus("success");
    setTxMessage(activeTab === "deposit" 
        ? `Successfully deposited ${data.amount} tUSD into vault.`
        : activeTab === 'withdraw'
          ? `Withdrawal request for ${data.amount} queued for KMS fulfillment.`
          : `Securely sent ${data.amount} tUSD to recipient.`
    );
    setTimeout(() => { setTxStatus("idle"); setActiveTab("dashboard"); }, 3000);
  };

  if (!walletAddress) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-slate-950"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="glass-panel border border-white/5 bg-slate-900/40 rounded-2xl p-10 md:p-14 flex flex-col items-center gap-8 max-w-sm w-full shadow-2xl shadow-slate-950/50"
        >
          {/* Logo — exact navbar format, scaled up */}
          <div className="flex items-center gap-3">
            <div className="bg-brand p-2.5 rounded-xl shadow-lg shadow-brand/30">
              <Shield className="text-white" size={32} />
            </div>
            <span className="font-black text-4xl tracking-tighter text-white">
              <span className="text-brand">Tulia</span>Pay
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-slate-400 font-medium leading-relaxed">
              Your connection has timed out. Please reconnect to access your private vault.
            </p>
          </div>

          <div className="w-full space-y-3">
            <Button variant="primary" size="lg" fullWidth onClick={handleConnect}>
              Reconnect Wallet
            </Button>
            <Link href="/" className="flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm">
              <ArrowLeft size={16} /> Back to Homepage
            </Link>
          </div>
        </motion.div>
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
                <ActiveWithdrawals 
                  hasPending={hasPendingWithdrawal} 
                  hasClaimable={hasClaimableETH} 
                  onCancel={handleCancelWithdrawal} 
                  onClaim={handleClaimETH} 
                />
                <MetricsGrid metrics={metrics} />
              </motion.div>
            )}

            {(activeTab === "deposit" || activeTab === "send" || activeTab === "withdraw") && (
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
