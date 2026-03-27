"use client"
import React from 'react'
import { Activity, Shield } from 'lucide-react'

interface MetricsGridProps {
  metrics: {
    totalHumans: number
    activeChannels: number
    totalEncryptedVolume: string
  }
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const data = [
    { label: "Verified Humans", value: metrics.totalHumans, color: "text-white" },
    { label: "Vault Privacy", value: "SECURE", color: "text-emerald-400" },
    { label: "Real Time Sync", value: `+${metrics.activeChannels}%`, color: "text-emerald-400" }
  ]

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-black flex items-center gap-3">
        <Activity className="text-brand-light" size={32} /> Intelligence
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {data.map((m, i) => (
          <div key={i} className="glass-panel p-8 md:p-10 group hover:border-brand/40 transition-all shadow-lg hover:shadow-brand/5 border-white/5 bg-slate-900/40 rounded-2xl md:rounded-[2rem]">
            <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">{m.label}</p>
            <p className={`text-4xl md:text-5xl font-black mt-4 flex items-center gap-3 ${m.color}`}>
              {m.label === "Vault Privacy" && <Shield size={32} />}
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
