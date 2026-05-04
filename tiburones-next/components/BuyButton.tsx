'use client'

import { useState } from 'react'

interface BuyButtonProps {
  className?: string
  label?: string
}

export default function BuyButton({ className = 'btn btn-primary', label = 'Comprar libro' }: BuyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function handleClick() {
    setStatus('loading')
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      if (!res.ok) {
        setStatus('error')
        return
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'error') {
    return (
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <button type="button" onClick={handleClick} className={className}>
          Reintentar
        </button>
        <span style={{ fontSize: '0.75rem', opacity: 0.6, color: 'inherit' }}>
          Error al conectar con el pago. Inténtalo de nuevo.
        </span>
      </span>
    )
  }

  return (
    <button type="button" onClick={handleClick} disabled={status === 'loading'} className={className}>
      {status === 'loading' ? 'Redirigiendo...' : label}
    </button>
  )
}
