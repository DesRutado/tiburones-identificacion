import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HeroWaves from '@/components/HeroWaves'

export const metadata: Metadata = {
  title: 'Identificación de Tiburones',
  description:
    'La guía de identificación de tiburones más completa en español. 518 especies, 103 géneros, 35 familias, 8 órdenes. Por Guillermo Carranza Hidalgo.',
  openGraph: {
    title: 'Identificación de Tiburones',
    description:
      'La guía de identificación de tiburones más completa en español. 518 especies, 103 géneros, 35 familias, 8 órdenes.',
    images: [{ url: '/img2.webp', width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <HeroWaves />

        <div className="hero-content">
          <p className="hero-eyebrow">Guillermo Carranza Hidalgo</p>
          <h1 className="hero-title">
            Identificación
            <br />
            <span>de Tiburones</span>
          </h1>
          <p className="hero-subtitle">8 órdenes · 35 familias · 103 géneros · 518 especies</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">518</span>
              <span className="stat-label">Especies</span>
            </div>
            <div className="stat">
              <span className="stat-number">35</span>
              <span className="stat-label">Familias</span>
            </div>
            <div className="stat">
              <span className="stat-number">103</span>
              <span className="stat-label">Géneros</span>
            </div>
          </div>
        </div>

        <div className="hero-cta">
          <a href="#adquirir" className="btn btn-primary">
            Adquirir el libro
          </a>
          <a href="#contenido" className="btn btn-secondary">
            Ver contenido
          </a>
        </div>

        <div className="scroll-hint">
          <span>Explorar</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── El libro ──────────────────────────────────── */}
      <section className="section-about" id="libro">
        <div className="inner">
          <div className="about-book">
            <Image
              src="/img2.webp"
              alt="Identificación de Tiburones — mockup 3D"
              width={720}
              height={900}
              className="book-mockup"
              style={{ width: '100%', height: 'auto', maxWidth: '360px' }}
            />
          </div>
          <div className="about-text">
            <p className="about-label">El libro</p>
            <h2 className="about-title">La guía definitiva para identificar tiburones</h2>
            <p className="about-body">
              Una obra de referencia exhaustiva que reúne por primera vez en español las 518 especies
              de tiburones conocidas, organizadas taxonómicamente en 8 órdenes y 35 familias. Desde
              el gran tiburón blanco hasta las especies más crípticas de aguas profundas.
            </p>
            <span className="book-tag">Primera edición en español</span>
          </div>
        </div>
      </section>

      {/* ── Contenido ─────────────────────────────────── */}
      <section className="section-features" id="contenido">
        <div className="inner">
          <div className="section-header">
            <span className="section-label">Contenido</span>
            <h2 className="section-title">Todo lo que necesitas saber</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="3" x2="12" y2="9" /><line x1="12" y1="9" x2="6" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" /><line x1="6" y1="15" x2="4" y2="21" />
                  <line x1="6" y1="15" x2="9" y2="21" /><line x1="18" y1="15" x2="15" y2="21" />
                  <line x1="18" y1="15" x2="20" y2="21" />
                </svg>
              </span>
              <h3 className="feature-title">Taxonomía completa</h3>
              <p className="feature-body">
                Clasificación actualizada según los estándares internacionales. Cada especie con su
                nomenclatura binomial, sinonimias y posición filogenética.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3c-2.5 4-2.5 14 0 18" /><path d="M12 3c2.5 4 2.5 14 0 18" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <path d="M4.5 7.5q7.5 3 15 0" /><path d="M4.5 16.5q7.5-3 15 0" />
                </svg>
              </span>
              <h3 className="feature-title">Distribución global</h3>
              <p className="feature-body">
                Mapas de distribución para cada especie. Profundidades, hábitats preferentes y rangos
                geográficos documentados.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="7.5" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </span>
              <h3 className="feature-title">Claves diagnósticas</h3>
              <p className="feature-body">
                Caracteres morfológicos diferenciales para identificar especies similares. Dentición,
                aletas, coloration patterns y medidas cefálicas.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2L3 6.5v6C3 17.7 7 21.5 12 23c5-1.5 9-5.3 9-10.5v-6z" />
                </svg>
              </span>
              <h3 className="feature-title">Estado de conservación</h3>
              <p className="feature-body">
                Estado IUCN actualizado para cada especie. Tendencias poblacionales, amenazas
                principales y medidas de protección vigentes.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 3l4 4L8 20H4v-4z" /><line x1="14" y1="6" x2="18" y2="10" />
                </svg>
              </span>
              <h3 className="feature-title">Ilustraciones de referencia</h3>
              <p className="feature-body">
                Siluetas anatómicas precisas que destacan los caracteres diagnósticos clave para la
                identificación en campo y laboratorio.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 7v14" />
                  <path d="M12 7C9.5 5.5 5 5.5 2 7v14c3-1.5 7.5-1.5 10 0" />
                  <path d="M12 7c2.5-1.5 7-1.5 10 0v14c-3-1.5-7.5-1.5-10 0" />
                </svg>
              </span>
              <h3 className="feature-title">Bibliografía extensa</h3>
              <p className="feature-body">
                Referencias bibliográficas primarias para cada taxón. Base científica sólida para
                investigadores, estudiantes y divulgadores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="section-stats">
        <div className="stats-grid">
          <div className="stat-item-big">
            <span className="stat-number">518</span>
            <span className="stat-label">Especies</span>
          </div>
          <div className="stat-item-big">
            <span className="stat-number">103</span>
            <span className="stat-label">Géneros</span>
          </div>
          <div className="stat-item-big">
            <span className="stat-number">35</span>
            <span className="stat-label">Familias</span>
          </div>
          <div className="stat-item-big">
            <span className="stat-number">8</span>
            <span className="stat-label">Órdenes</span>
          </div>
        </div>
      </section>

      {/* ── Autor ─────────────────────────────────────── */}
      <section className="section-author" id="autor">
        <div className="inner">
          <Image
            src="/img3.webp"
            alt="Logo Identificación de Tiburones"
            width={72}
            height={72}
            className="author-avatar"
          />
          <div className="author-line" />
          <h2 className="author-name">Guillermo Carranza Hidalgo</h2>
          <p className="author-bio">
            Naturalista y divulgador científico especializado en elasmobranquios. Años de
            investigación y trabajo de campo han dado lugar a la obra de referencia más completa
            sobre identificación de tiburones en lengua española.
          </p>
          <a
            href="https://instagram.com/identificaciondetiburones"
            className="author-handle"
            target="_blank"
            rel="noopener noreferrer"
          >
            @identificaciondetiburones
          </a>
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────── */}
      <section className="section-cta" id="adquirir">
        <span className="section-label">Disponible ahora</span>
        <h2 className="section-title">¿Listo para sumergirte?</h2>
        <p className="cta-sub">La guía de identificación de tiburones más completa en español</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" className="btn btn-primary">
            Adquirir el libro
          </a>
          <a
            href="https://instagram.com/identificaciondetiburones"
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Seguir en Instagram
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
