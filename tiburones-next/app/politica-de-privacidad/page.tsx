import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HeroWaves from '@/components/HeroWaves'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de Identificación de Tiburones conforme al RGPD.',
}

export default function PoliticaDePrivacidad() {
  return (
    <>
      <Nav />

      <section className="hero blog-hero">
        <HeroWaves compact />
        <div className="hero-content">
          <p className="hero-eyebrow">Legal</p>
          <h1 className="hero-title">Política de Privacidad</h1>
        </div>
      </section>

      <div className="blog-wrapper">
        <div className="blog-content">
          <article className="post-content" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <p>
              <strong>Última actualización:</strong> 1 de mayo de 2026
            </p>

            <h2>1. Responsable del tratamiento</h2>
            <p>
              Guillermo Carranza Hidalgo<br />
              Sitio web: <strong>identificaciondetiburones.com</strong>
            </p>

            <h2>2. Datos que recopilamos</h2>
            <p>Este sitio web puede recopilar los siguientes datos personales:</p>
            <ul>
              <li>
                <strong>Comentarios en el blog:</strong> nombre y texto del comentario que el usuario introduce voluntariamente al publicar un comentario.
              </li>
              <li>
                <strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y duración de la visita, recopilados de forma anónima a través del servidor web.
              </li>
            </ul>

            <h2>3. Finalidad del tratamiento</h2>
            <ul>
              <li>Publicar y gestionar los comentarios enviados por los usuarios en los artículos del blog.</li>
              <li>Garantizar la seguridad del sitio web y prevenir el abuso.</li>
              <li>Mejorar la experiencia de navegación y el contenido publicado.</li>
            </ul>

            <h2>4. Base jurídica</h2>
            <p>
              El tratamiento de los datos se basa en el <strong>consentimiento del usuario</strong> (Art. 6.1.a del RGPD) al enviar un comentario de forma voluntaria, y en el <strong>interés legítimo</strong> del responsable (Art. 6.1.f del RGPD) para garantizar la seguridad del sitio.
            </p>

            <h2>5. Conservación de los datos</h2>
            <p>
              Los comentarios y los datos asociados se conservan indefinidamente para mantener la coherencia de las conversaciones en el blog. El usuario puede solicitar su eliminación en cualquier momento.
            </p>

            <h2>6. Destinatarios</h2>
            <p>
              Los datos no se ceden a terceros salvo obligación legal. Los comentarios se almacenan en <strong>Supabase</strong> (infraestructura de base de datos en la nube). El sitio se aloja en <strong>Vercel</strong>. Ambos proveedores cumplen con el RGPD y ofrecen garantías adecuadas de protección de datos.
            </p>

            <h2>7. Derechos del usuario</h2>
            <p>Puedes ejercer los siguientes derechos en cualquier momento:</p>
            <ul>
              <li><strong>Acceso:</strong> obtener información sobre los datos que tratamos sobre ti.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de tus datos (&quot;derecho al olvido&quot;).</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento en determinadas circunstancias.</li>
            </ul>
            <p>
              Para ejercer estos derechos, puedes contactar a través del sitio web. También tienes derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.
            </p>

            <h2>8. Cookies</h2>
            <p>
              Este sitio no utiliza cookies de seguimiento ni de publicidad. Únicamente pueden generarse cookies técnicas estrictamente necesarias para el funcionamiento del sitio (por ejemplo, para gestionar sesiones de servidor).
            </p>

            <h2>9. Rastreadores de inteligencia artificial</h2>
            <p>
              El contenido de este sitio es accesible para rastreadores de motores de búsqueda e inteligencia artificial (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). No se recopilan datos personales de los visitantes a través de estos sistemas.
            </p>

            <h2>10. Cambios en esta política</h2>
            <p>
              Esta política puede actualizarse para reflejar cambios en la legislación o en el funcionamiento del sitio. La fecha de última actualización siempre aparece al inicio de esta página.
            </p>
          </article>
        </div>
      </div>

      <Footer />
    </>
  )
}
