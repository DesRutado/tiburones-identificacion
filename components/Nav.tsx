'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav>
      <Link href="/" className="nav-logo">
        <Image src="/img3.webp" alt="Logo" width={28} height={28} className="nav-avatar" />
        Identificación de Tiburones
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/#libro">El Libro</Link>
        </li>
        <li>
          <Link href="/#contenido">Contenido</Link>
        </li>
        <li>
          <Link href="/blog" className={pathname.startsWith('/blog') ? 'active' : ''}>
            Artículos
          </Link>
        </li>
        <li>
          <Link href="/#autor">Autor</Link>
        </li>
        <li>
          <Link href="/#adquirir">Adquirir</Link>
        </li>
      </ul>
    </nav>
  )
}
