"use client";

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
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-200">
      {/* Top Navbar */}
      <nav className="glass-panel sticky top-0 z-50 rounded-none border-t-0 border-x-0 border-b border-white/5 py-4 px-8 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          <div className="bg-brand p-1.5 rounded-lg shadow-lg shadow-brand/20">
            <Shield className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">TuliaPay</span>
        </div>
        <div className="flex items-center gap-4 font-bold">
          <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 text-sm">
            <Shield size={16} /> Human Verified
          </div>
          <div className="bg-slate-900 border border-slate-800 px-5 py-2 rounded-xl text-slate-300 font-mono text-sm">
            {walletAddress}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 p-6 space-y-12">
        {/* Transaction Overlays */}
        {txStatus !== "idle" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6">
            <div className="glass-panel p-10 max-w-sm w-full text-center space-y-6 border-brand/30 shadow-2xl shadow-brand/10">
              {txStatus === "processing" && <Loader2 size={64} className="animate-spin text-brand mx-auto" />}
              {txStatus === "success" && <CheckCircle2 size={64} className="text-emerald-400 mx-auto" />}
              {txStatus === "error" && <XCircle size={64} className="text-rose-400 mx-auto" />}
              <div className="space-y-2">
                <h4 className="text-2xl font-black capitalize text-white">{txStatus}</h4>
                <p className="text-slate-400 font-medium">{txMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <>
            <div className="relative overflow-hidden rounded-[2.5rem] p-10 shadow-2xl shadow-brand/20 bg-gradient-to-br from-brand via-brand/90 to-brand-light border border-white/20">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-400 opacity-10 rounded-full blur-2xl"></div>
              
              <p className="text-white/80 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <Wallet size={16} /> Encrypted Private Vault
              </p>
              
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h2 className="text-7xl font-black text-white tracking-tighter">
                    {balance !== "****" && "$"}
                    {balance}
                  </h2>
                  <button 
                    onClick={handleToggleBalance}
                    className="p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all text-white backdrop-blur-md"
                  >
                    {balance === "****" ? <Eye size={32} /> : <EyeOff size={32} />}
                  </button>
                </div>
              </div>
              
              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => setActiveTab("deposit")}
                  className="flex-1 bg-white text-brand py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition shadow-xl"
                >
                  <ArrowDownToLine size={24} /> Deposit
                </button>
                <button 
                  onClick={() => setActiveTab("send")}
                  className="flex-1 bg-slate-950/40 text-white backdrop-blur-md py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition border border-white/10 shadow-xl"
                >
                  <Send size={24} /> Send
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <Activity className="text-brand-light" size={28} /> Network Intelligence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: "Verified Humans", value: metrics.totalHumans, color: "text-white" },
                  { label: "Vault Privacy", value: "Locked", color: "text-emerald-400" },
                  { label: "Active Channels", value: metrics.activeChannels, color: "text-white" }
                ].map((m, i) => (
                  <div key={i} className="glass-panel p-8 group hover:border-brand/40 transition-colors">
                    <p className="text-slate-500 text-sm font-black uppercase tracking-widest leading-none">{m.label}</p>
                    <p className={`text-4xl font-black mt-3 flex items-center gap-2 ${m.color}`}>
                      {m.label === "Vault Privacy" && <Shield size={24} />}
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action Forms */}
        {(activeTab === "deposit" || activeTab === "send") && (
          <div className="max-w-xl mx-auto space-y-8 animate-slide-up">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="p-3 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <XCircle size={28} />
              </button>
              <h2 className="text-4xl font-black capitalize text-white">{activeTab}</h2>
            </div>

            <div className="glass-panel p-10 space-y-8 border-brand/20">
              <form onSubmit={activeTab === "deposit" ? handleDeposit : handleSend} className="space-y-8">
                {activeTab === "send" && (
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase text-slate-500 tracking-widest">Recipient Address</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white font-mono placeholder:text-slate-700 focus:outline-none focus:border-brand/60"
                      placeholder="0x..."
                      required
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase text-slate-500 tracking-widest">Amount (tUSD)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-5xl font-black text-white focus:outline-none focus:border-brand/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0.00"
                      step="0.01"
                      required
                      value={activeTab === "deposit" ? depositAmount : sendAmount}
                      onChange={(e) => activeTab === "deposit" ? setDepositAmount(e.target.value) : setSendAmount(e.target.value)}
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-600 text-2xl">tUSD</div>
                  </div>
                </div>

                <div className="p-6 bg-brand/5 rounded-2xl border border-brand/20 flex gap-4">
                  <Shield className="text-brand shrink-0" />
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    This transaction will be processed using **Zama FHE**. Your balance and 
                    the amount will remain encrypted on-chain.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-white text-brand font-black rounded-2xl text-2xl hover:scale-[1.01] transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
                >
                  {activeTab === "deposit" ? "Confirm Encrypted Deposit" : "Secure Privacy Transfer"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
