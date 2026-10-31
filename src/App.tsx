import { useEffect, useState } from 'react'
import { contact, content, type Lang } from './content'
import { Icon } from './icons'

const STORAGE_KEY = 'lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    /* almacenamiento no disponible */
  }
  return 'es'
}

function Photo({ alt }: { alt: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="photo photo--initials" role="img" aria-label={alt}>
        <span aria-hidden="true">PR</span>
      </div>
    )
  }
  return (
    <img
      className="photo"
      src="/foto.jpg"
      alt={alt}
      width={600}
      height={600}
      fetchPriority="high"
      onError={() => setFailed(true)}
    />
  )
}

function SectionTitle({ id, index, children }: { id: string; index: string; children: string }) {
  return (
    <h2 className="section-title" id={id}>
      <span className="section-title__index" aria-hidden="true">
        {index}
      </span>
      {children}
    </h2>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const t = content[lang]
  const other: Lang = lang === 'es' ? 'en' : 'es'

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignorar */
    }
  }, [lang, t])

  // Aparición suave de secciones (desactivada con prefers-reduced-motion vía CSS)
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    let fired = false
    const io = new IntersectionObserver(
      (entries) => {
        fired = true
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))
    // Red de seguridad: si el observer no llega a dispararse nunca (pestaña en segundo
    // plano, capturas automáticas…), mostramos todo igualmente.
    const fallback = window.setTimeout(() => {
      if (!fired) els.forEach((el) => el.classList.add('is-visible'))
    }, 2000)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  const navItems: [string, string][] = [
    ['sobre-mi', t.nav.about],
    ['experiencia', t.nav.experience],
    ['proyectos', t.nav.projects],
    ['habilidades', t.nav.skills],
    ['formacion', t.nav.education],
    ['contacto', t.nav.contact],
  ]

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipLink}
      </a>

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#top" aria-label="Pablo Rojo Hernández">
            <span className="brand__mark" aria-hidden="true">
              PR
            </span>
            <span className="brand__name">Pablo Rojo</span>
          </a>
          <nav aria-label={lang === 'es' ? 'Principal' : 'Main'} className="site-nav">
            <ul>
              {navItems.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(other)}
            aria-label={t.langToggle.label}
            lang={other}
          >
            <Icon name="globe" />
            <span>{t.langToggle.short}</span>
          </button>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* HERO */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container hero__inner">
            <div className="hero__text">
              <p className="hero__greeting">{t.hero.greeting}</p>
              <h1 id="hero-title" className="hero__name">
                {t.hero.name}
              </h1>
              <p className="hero__role">
                {t.hero.role}
                <span className="hero__location">
                  <Icon name="pin" /> {t.hero.location}
                </span>
              </p>
              <p className="hero__pitch">{t.hero.pitch}</p>
              <div className="hero__ctas">
                <a className="btn btn--primary" href="#proyectos">
                  {t.hero.ctaProjects}
                  <Icon name="arrow-down" />
                </a>
                <a className="btn btn--ghost" href="#contacto">
                  {t.hero.ctaContact}
                </a>
              </div>
            </div>
            <div className="hero__photo">
              <div className="hero__photo-frame">
                <Photo alt={t.hero.photoAlt} />
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE MÍ */}
        <section className="section reveal" aria-labelledby="sobre-mi">
          <div className="container">
            <SectionTitle id="sobre-mi" index="01">
              {t.about.title}
            </SectionTitle>
            <div className="about">
              <div className="about__text">
                {t.about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="about__highlights">
                {t.about.highlights.map((h) => (
                  <li key={h.label}>
                    <span className="about__value">{h.value}</span>
                    <span className="about__label">{h.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* EXPERIENCIA */}
        <section className="section section--tint reveal" aria-labelledby="experiencia">
          <div className="container">
            <SectionTitle id="experiencia" index="02">
              {t.experience.title}
            </SectionTitle>
            <ol className="timeline">
              {t.experience.items.map((item) => (
                <li key={item.role + item.period} className={item.current ? 'timeline__item is-current' : 'timeline__item'}>
                  <div className="timeline__meta">
                    <span className="timeline__period">{item.period}</span>
                  </div>
                  <div className="timeline__body">
                    <h3>
                      {item.role} <span className="timeline__company">· {item.company}</span>
                    </h3>
                    <ul>
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PROYECTOS */}
        <section className="section reveal" aria-labelledby="proyectos">
          <div className="container">
            <SectionTitle id="proyectos" index="03">
              {t.projects.title}
            </SectionTitle>
            <p className="section-intro">{t.projects.intro}</p>
            <div className="projects">
              {t.projects.items.map((p, i) => (
                <article key={p.title} className={i === 0 ? 'card card--featured' : 'card'}>
                  {p.kicker && <p className="card__kicker">{p.kicker}</p>}
                  <h3 className="card__title">{p.title}</h3>
                  <p className="card__desc">{p.description}</p>
                  {p.bullets && (
                    <ul className="card__bullets">
                      {p.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  <ul className="tags" aria-label={lang === 'es' ? 'Tecnologías' : 'Tech stack'}>
                    {p.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {p.link && (
                    <p className="card__link">
                      <a href={p.link.href} target="_blank" rel="noopener noreferrer">
                        {p.link.label}
                        <Icon name="external" />
                        <span className="sr-only">{lang === 'es' ? '(se abre en otra pestaña)' : '(opens in a new tab)'}</span>
                      </a>
                      {p.link.note && (
                        <span className="badge">
                          <Icon name="lock" /> {p.link.note}
                        </span>
                      )}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HABILIDADES */}
        <section className="section section--tint reveal" aria-labelledby="habilidades">
          <div className="container">
            <SectionTitle id="habilidades" index="04">
              {t.skills.title}
            </SectionTitle>
            <div className="skills">
              {t.skills.groups.map((g) => (
                <div key={g.name} className="skills__group">
                  <h3>{g.name}</h3>
                  <ul className="tags tags--large">
                    {g.items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORMACIÓN + IDIOMAS */}
        <section className="section reveal" aria-labelledby="formacion">
          <div className="container">
            <SectionTitle id="formacion" index="05">
              {t.education.title}
            </SectionTitle>
            <div className="education">
              <ul className="edu-list">
                {t.education.items.map((e) => (
                  <li key={e.title}>
                    <Icon name="cap" />
                    <div>
                      <h3>{e.title}</h3>
                      <p>
                        {e.school} <span className="muted">· {e.period}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="languages">
                <h3>{t.education.languagesTitle}</h3>
                <dl>
                  {t.education.languages.map((l) => (
                    <div key={l.name}>
                      <dt>{l.name}</dt>
                      <dd>{l.level}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section className="section contact reveal" aria-labelledby="contacto">
          <div className="container contact__inner">
            <SectionTitle id="contacto" index="06">
              {t.contactSection.title}
            </SectionTitle>
            <p className="contact__text">{t.contactSection.text}</p>
            <div className="contact__actions">
              <a className="btn btn--light" href={`mailto:${contact.email}`}>
                <Icon name="mail" />
                {t.contactSection.emailCta}
              </a>
              <a className="btn btn--outline-light" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                <Icon name="linkedin" />
                {t.contactSection.linkedinCta}
                <span className="sr-only">{lang === 'es' ? '(se abre en otra pestaña)' : '(opens in a new tab)'}</span>
              </a>
            </div>
            <p className="contact__email">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>
            © {new Date().getFullYear()} {t.footer.rights}
          </p>
          <p className="muted">{t.footer.built}</p>
        </div>
      </footer>
    </>
  )
}
