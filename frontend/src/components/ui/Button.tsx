"use client"

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger' | 'white'

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'size' | 'children'> {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  icon?: LucideIcon
  iconRight?: boolean
  isLoading?: boolean
  fullWidth?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-light",
  secondary: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20",
  outline: "bg-transparent border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20",
  ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
  glass: "bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20",
  danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
  white: "bg-white text-slate-950 shadow-xl hover:scale-105"
}

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
  xl: "px-10 py-5 text-xl",
  "2xl": "px-12 py-6 text-2xl"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  iconRight = false, 
  isLoading, 
  fullWidth, 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center font-black rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-3 tracking-tight
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4 mr-2" />
      ) : (
        !iconRight && Icon && <Icon size={size === 'xl' || size === '2xl' ? 28 : 20} />
      )}
      {children}
      {!isLoading && iconRight && Icon && <Icon size={size === 'xl' || size === '2xl' ? 28 : 20} />}
    </motion.button>
  )
})

Button.displayName = "Button"
