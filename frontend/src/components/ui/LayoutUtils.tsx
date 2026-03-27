import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
}

export const Container = ({ children, className = '', maxWidth = '7xl' }: ContainerProps) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-none'
  }

  return (
    <div className={`mx-auto w-full px-6 md:px-12 ${maxWidths[maxWidth]} ${className}`}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Section = ({ children, className = '', id, padding = 'lg' }: SectionProps) => {
  const paddings = {
    none: 'py-0',
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-24 md:py-32',
    xl: 'py-32 md:py-48'
  }

  return (
    <section id={id} className={`relative overflow-hidden w-full ${paddings[padding]} ${className}`}>
      {children}
    </section>
  )
}
