import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer>
      <Link href="/" className="footer-logo">
        <Image src="/img3.webp" alt="Logo" width={28} height={28} className="nav-avatar" />
        Identificación de Tiburones
      </Link>
      <a
        href="https://instagram.com/identificaciondetiburones"
        className="footer-ig"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
        @identificaciondetiburones
      </a>
      <div className="footer-copy">© 2025 Guillermo Carranza Hidalgo</div>
    </footer>
  )
}
