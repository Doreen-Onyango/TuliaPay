import React from 'react'
import { motion } from 'framer-motion'
import { Timer, AlertCircle, RefreshCcw, HandCoins } from 'lucide-react'
import { Button } from '../../ui/Button'

interface ActiveWithdrawalsProps {
  hasPending: boolean
  hasClaimable: boolean
  onCancel: () => Promise<void>
  onClaim: () => Promise<void>
}

export const ActiveWithdrawals = ({ hasPending, hasClaimable, onCancel, onClaim }: ActiveWithdrawalsProps) => {
  if (!hasPending && !hasClaimable) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl border border-brand/20 bg-slate-900/60 flex flex-col gap-6"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="text-brand" size={24} />
        <h3 className="text-xl font-black text-white px-2">Action Required</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {hasPending && (
          <div className="flex-1 bg-slate-950/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Timer size={18} />
                <span>Stalled Withdrawal</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your withdrawal request has been pending for over 1 hour. You can safely void the request and recover your FHE wrapped funds natively.
              </p>
            </div>
            <Button variant="outline" size="md" fullWidth onClick={onCancel} className="bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-300">
              <RefreshCcw size={16} className="mr-2" />
              Cancel & Refund
            </Button>
          </div>
        )}

        {hasClaimable && (
          <div className="flex-1 bg-slate-950/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <HandCoins size={18} />
                <span>Claimable ETH Fallback</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                A relayer executed your withdrawal natively, but your wallet contract trapped the ETH payload. You can manually pull your balance securely.
              </p>
            </div>
            <Button variant="outline" size="md" fullWidth onClick={onClaim} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300">
              <HandCoins size={16} className="mr-2" />
              Claim Native ETH
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
