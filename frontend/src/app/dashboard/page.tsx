"use client"

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Shield, 
  Send, 
  ArrowDownToLine, 
  Eye, 
  EyeOff, 
  Activity, 
  Wallet, 
  BotOff, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  LogOut,
  Copy,
  ChevronDown,
  Check
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
  
  // Wallet interaction states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleConnect = () => setWalletAddress("0x7F5A4bD2d78B9c4E9F1A3B8C7D6E5F4A3B2aC9");
  const handleWorldIDVerify = () => setIsVerified(true);
  const handleDisconnect = () => {
    setWalletAddress(null);
    setIsVerified(false);
    setIsDropdownOpen(false);
  };
  
  const handleToggleBalance = () => {
    setBalance(balance === "****" ? "1,240.50" : "****");
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxStatus("processing");
    setTxMessage("Generating local FHE proof...");
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center p-6 space-y-8 bg-slate-950"
      >
        <div className="p-4 bg-brand rounded-full shadow-lg shadow-brand/40 animate-pulse">
          <Shield size={64} className="text-white" />
        </div>
        <div className="space-y-4 max-w-md">
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-light to-emerald-400 tracking-tighter">
            TuliaPay
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Your connection has timed out. Please reconnect to access your private vault.
          </p>
        </div>
        <button 
          onClick={handleConnect}
          className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
        >
          Reconnect Wallet
        </button>
        <Link href="/" className="text-slate-500 hover:text-white transition-colors font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Homepage
        </Link>
      </motion.div>
    );
  }

  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-20 bg-slate-950 text-slate-200"
    >
      {/* Top Navbar */}
      <nav className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-b border-white/5 py-4 px-8 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform">
          <div className="bg-brand p-1.5 rounded-lg shadow-lg shadow-brand/20 group-hover:bg-brand-light transition-colors">
            <Shield className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">TuliaPay</span>
        </Link>
        
        <div className="flex items-center gap-6 font-bold">
          {isVerified && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 text-sm">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              Human Verified
            </div>
          )}
          
          {/* Wallet Dropdown Wrapper */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-300 ${isDropdownOpen ? 'bg-slate-900 border-brand/50 text-white' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/20'}`}
            >
              <div className="w-2 h-2 bg-brand rounded-full"></div>
              <span className="font-mono text-xs">{truncatedAddress}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-brand' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-6 w-80 glass-panel p-6 border-brand/30 shadow-3xl shadow-black/80 space-y-6 z-[200] bg-slate-900/95"
                >
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Connected Wallet</p>
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 break-all font-mono text-xs text-brand-light leading-relaxed">
                      {walletAddress}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={handleCopyAddress}
                      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group"
                    >
                      <span className="text-sm font-bold text-slate-300">Copy Address</span>
                      {isCopied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} className="text-slate-500 group-hover:text-white transition-colors" />}
                    </button>

                    <button 
                      onClick={handleDisconnect}
                      className="w-full flex items-center justify-between p-4 bg-rose-500/5 rounded-xl hover:bg-rose-500/10 transition-colors border border-rose-500/10 group"
                    >
                      <span className="text-sm font-bold text-rose-400">Disconnect</span>
                      <LogOut size={18} className="text-rose-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 p-6 space-y-12">
        <AnimatePresence>
          {txStatus !== "idle" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass-panel p-10 max-w-sm w-full text-center space-y-6 border-brand/30 shadow-2xl shadow-brand/10"
              >
                {txStatus === "processing" && <Loader2 size={64} className="animate-spin text-brand mx-auto" />}
                {txStatus === "success" && <CheckCircle2 size={64} className="text-emerald-400 mx-auto" />}
                {txStatus === "error" && <XCircle size={64} className="text-rose-400 mx-auto" />}
                <div className="space-y-2">
                  <h4 className="text-2xl font-black capitalize text-white">{txStatus}</h4>
                  <p className="text-slate-400 font-medium">{txMessage}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isVerified ? (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="glass-panel p-12 flex flex-col items-center text-center space-y-8 max-w-xl mx-auto w-full border-brand/20 shadow-2xl"
           >
             <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center shadow-inner border border-slate-800">
               <BotOff size={40} className="text-brand-light" />
             </div>
             <div className="space-y-3">
               <h2 className="text-3xl font-black text-white">Bot Protection</h2>
               <p className="text-slate-400 text-lg leading-relaxed font-medium">
                 All users must verify humanity via World ID before accessing the encrypted vault.
               </p>
             </div>
             <button 
               onClick={handleWorldIDVerify}
               className="w-full py-5 bg-brand text-white font-black rounded-2xl hover:bg-brand-light transition-all flex items-center justify-center gap-4 text-xl shadow-lg shadow-brand/30 active:scale-[0.98]"
             >
               <Shield size={24} /> Verify with World ID
             </button>
           </motion.div>
        ) : (
          <div className="space-y-12">
            {activeTab === "dashboard" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="relative overflow-hidden rounded-[3rem] p-12 shadow-3xl shadow-brand/20 bg-gradient-to-br from-brand via-brand/90 to-brand-light border border-white/20 group">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                  <p className="text-white/80 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                    <Wallet size={16} /> Encrypted Private Vault
                  </p>
                  
                  <div className="mt-10 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <h2 className="text-8xl font-black text-white tracking-tighter">
                        {balance !== "****" && "$"}
                        {balance}
                      </h2>
                      <button 
                        onClick={handleToggleBalance}
                        className="p-5 bg-white/20 hover:bg-white/30 rounded-2xl transition-all text-white backdrop-blur-md active:scale-90"
                      >
                        {balance === "****" ? <Eye size={36} /> : <EyeOff size={36} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-14 flex gap-6">
                    <button 
                      onClick={() => setActiveTab("deposit")}
                      className="flex-1 bg-white text-brand py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.03] transition shadow-xl active:scale-[0.98]"
                    >
                      <ArrowDownToLine size={28} /> Deposit
                    </button>
                    <button 
                      onClick={() => setActiveTab("send")}
                      className="flex-1 bg-slate-950/40 text-white backdrop-blur-md py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.03] transition border border-white/10 shadow-xl active:scale-[0.98]"
                    >
                      <Send size={28} /> Send
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-3xl font-black flex items-center gap-3">
                    <Activity className="text-brand-light" size={32} /> Intelligence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { label: "Verified Humans", value: metrics.totalHumans, color: "text-white" },
                      { label: "Vault Privacy", value: "Locked", color: "text-emerald-400" },
                      { label: "Active Channels", value: metrics.activeChannels, color: "text-white" }
                    ].map((m, i) => (
                      <div key={i} className="glass-panel p-10 group hover:border-brand/40 transition-all shadow-lg hover:shadow-brand/5 border-white/5">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest leading-none">{m.label}</p>
                        <p className={`text-5xl font-black mt-4 flex items-center gap-3 ${m.color}`}>
                          {m.label === "Vault Privacy" && <Shield size={32} />}
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {(activeTab === "deposit" || activeTab === "send") && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-xl mx-auto space-y-10"
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveTab("dashboard")}
                    className="p-4 bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-all shadow-inner border border-white/5"
                  >
                    <ArrowLeft size={32} />
                  </button>
                  <h2 className="text-5xl font-black capitalize text-white">{activeTab}</h2>
                </div>

                <div className="glass-panel p-12 space-y-10 border-brand/20 shadow-2xl">
                  <form onSubmit={activeTab === "deposit" ? handleDeposit : handleSend} className="space-y-10">
                    {activeTab === "send" && (
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Recipient Address</label>
                        <input 
                          type="text"
                          className="w-full bg-slate-950/50 border border-white/5 p-6 rounded-2xl text-white font-mono placeholder:text-slate-800 focus:outline-none focus:border-brand/40 transition-colors"
                          placeholder="0x..."
                          required
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Amount (tUSD)</label>
                      <div className="relative">
                        <input 
                          type="number"
                          className="w-full bg-slate-950/50 border border-white/5 p-10 rounded-3xl text-6xl font-black text-white focus:outline-none focus:border-brand/40 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0.00"
                          step="0.01"
                          required
                          value={activeTab === "deposit" ? depositAmount : sendAmount}
                          onChange={(e) => activeTab === "deposit" ? setDepositAmount(e.target.value) : setSendAmount(e.target.value)}
                        />
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 font-black text-slate-700 text-3xl">tUSD</div>
                      </div>
                    </div>

                    <div className="p-8 bg-brand/5 rounded-3xl border border-brand/20 flex gap-5">
                      <Shield className="text-brand shrink-0" size={32} />
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        This operation is secured by **fhEVM**. Your data is never decrypted during computation.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-7 bg-white text-brand font-black rounded-3xl text-3xl hover:scale-[1.02] transition-all shadow-2xl active:scale-[0.98]"
                    >
                      {activeTab === "deposit" ? "Sign Deposit" : "Confirm Send"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </motion.div>
  );
}
