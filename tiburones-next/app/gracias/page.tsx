import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HeroWaves from '@/components/HeroWaves'

export const metadata: Metadata = {
  title: 'Gracias por tu compra',
  description: 'Tu pedido de Identificación de Tiburones ha sido confirmado.',
  robots: { index: false },
}

export default function GraciasPage() {
  return (
    <>
      <Nav />

      <section className="hero blog-hero">
        <HeroWaves compact />
        <div className="hero-content">
          <p className="hero-eyebrow">Pedido confirmado</p>
          <h1 className="hero-title">Gracias por tu compra</h1>
        </div>
      </section>

      <div className="blog-wrapper">
        <div className="blog-content">
          <div className="gracias-content">
            <p className="gracias-lead">
              Tu ejemplar de <em>Identificación de Tiburones</em> está en camino.
            </p>
            <p className="gracias-body">
              Recibirás un correo de confirmación con los detalles del pedido. El libro se enviará en
              un plazo de <strong>3 a 5 días hábiles</strong> a la dirección que has indicado.
            </p>
            <p className="gracias-body">
              Si tienes cualquier duda sobre tu envío, escríbenos a través de Instagram.
            </p>
            <div className="gracias-actions">
              <Link href="/" className="btn btn-primary">
                Volver al inicio
              </Link>
              <Link href="/blog" className="btn btn-secondary">
                Explorar artículos
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
