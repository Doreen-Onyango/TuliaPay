"use client"

import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Shield, Send, ArrowDownToLine, Eye, EyeOff, Activity, Wallet, BotOff } from 'lucide-react';
import { 
  walletAddressAtom, 
  isVerifiedHumanAtom, 
  encryptedBalanceAtom, 
  activeTabAtom,
  globalMetricsAtom
} from '../store';

// We mock the WorldID integration visually for the scaffolding
export default function TuliaPayDashboard() {
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [isVerified, setIsVerified] = useAtom(isVerifiedHumanAtom);
  const [balance, setBalance] = useAtom(encryptedBalanceAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [metrics] = useAtom(globalMetricsAtom);

  // Mocking standard connection
  const handleConnect = () => {
    setWalletAddress("0x7F5...3aB9");
  };

  const handleWorldIDVerify = () => {
    // In production: trigger IDKitWidget
    setIsVerified(true);
  };

  const handleToggleBalance = () => {
    // In production: prompt for EIP-712 Reencryption signature
    setBalance(balance === "****" ? "124.50" : "****");
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 space-y-8">
        <div className="p-4 bg-brand rounded-full shadow-lg shadow-brand/40 animate-fade-in">
          <Shield size={64} className="text-white" />
        </div>
        <div className="space-y-4 max-w-md animate-fade-in" style={{animationDelay: '0.1s'}}>
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400">
            TuliaPay
          </h1>
          <p className="text-slate-400 text-lg">
            Send and receive money privately, only for humans, verified and secure.
          </p>
        </div>
        <button 
          onClick={handleConnect}
          className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-fade-in"
          style={{animationDelay: '0.2s'}}
        >
          Connect Wallet to Enter
        </button>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="glass-panel p-10 flex flex-col items-center text-center space-y-6 max-w-lg w-full animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center shadow-inner border border-slate-700">
            <BotOff size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">Bot Protection Enabled</h2>
          <p className="text-slate-400">
            TuliaPay operates a strict zero-bot policy. Please verify your humanity 
            using World ID to access encrypted banking.
          </p>
          <button 
            onClick={handleWorldIDVerify}
            className="w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-3"
          >
            <Shield size={20} /> Verify with World ID
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Top Navbar */}
      <nav className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="text-brand-light" size={24} />
          <span className="font-bold text-xl tracking-tight">TuliaPay</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Shield size={14} /> Human Verified
          </div>
          <div className="bg-white/5 px-4 py-1.5 rounded-full text-slate-300">
            {walletAddress}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 p-6 space-y-8">
        {/* Main Balance Card */}
        <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl shadow-brand/20 bg-gradient-to-br from-brand/80 to-slate-800 border border-white/10">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          
          <p className="text-brand-light font-medium flex items-center gap-2">
            <Wallet size={18} /> Encrypted Private Vault
          </p>
          
          <div className="mt-4 flex items-end justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-6xl font-black text-white tracking-tighter">
                {balance !== "****" && "$"}
                {balance}
              </h2>
              <button 
                onClick={handleToggleBalance}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                title="Decrypt Balance"
              >
                {balance === "****" ? <Eye size={24} /> : <EyeOff size={24} />}
              </button>
            </div>
          </div>
          
          <div className="mt-10 flex gap-4">
            <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition shadow-lg">
              <ArrowDownToLine size={20} /> Deposit
            </button>
            <button className="flex-1 bg-slate-800/80 text-white backdrop-blur-md py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition border border-white/10 shadow-lg">
              <Send size={20} /> Send Privately
            </button>
          </div>
        </div>

        {/* Human Metrics */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="text-brand-light" /> TuliaMetrics (Human Only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6">
              <p className="text-slate-400 text-sm font-medium">Verified Humans</p>
              <p className="text-3xl font-black text-white mt-1">{metrics.totalHumans}</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-slate-400 text-sm font-medium">On-Chain Volume</p>
              <p className="text-3xl font-black text-emerald-400 mt-1 flex items-center gap-2">
                <Shield size={20} /> Encrypted
              </p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-slate-400 text-sm font-medium">Active Safe Channels</p>
              <p className="text-3xl font-black text-white mt-1">{metrics.activeChannels}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
