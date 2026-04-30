'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/#libro', label: 'El Libro' },
  { href: '/#contenido', label: 'Contenido' },
  { href: '/#autor', label: 'Autor' },
  { href: '/#adquirir', label: 'Adquirir' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav>
      <Link href="/" className="nav-logo">
        <Image src="/img3.webp" alt="Logo" width={28} height={28} className="nav-avatar" />
        Identificación de Tiburones
      </Link>

      <ul className="nav-links">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={href === '/blog' && pathname.startsWith('/blog') ? 'active' : ''}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        className="nav-hamburger"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div className="nav-mobile">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={href === '/blog' && pathname.startsWith('/blog') ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
