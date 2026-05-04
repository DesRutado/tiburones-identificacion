'use client'

import { useState } from 'react'

interface BuyButtonProps {
  className?: string
  label?: string
}

export default function BuyButton({ className = 'btn btn-primary', label = 'Comprar libro' }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? 'Redirigiendo...' : label}
    </button>
  )
}
