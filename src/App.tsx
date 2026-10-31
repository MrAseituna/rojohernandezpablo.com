import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { contact, content, marquee, type Lang } from './content'
import { Icon } from './icons'

const STORAGE_KEY = 'lang'
const SECTIONS = ['sobre-mi', 'experiencia', 'proyectos', 'stack', 'formacion', 'contacto'] as const

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    /* almacenamiento no disponible */
  }
  return 'es'
}

// Brillo que sigue al puntero dentro de una tarjeta (posición en variables CSS)
const spotlight = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function Card({ className = '', children, as: Tag = 'article' }: { className?: string; children: ReactNode; as?: 'article' | 'div' | 'li' }) {
  return (
    <Tag className={`card ${className}`} onPointerMove={spotlight}>
      {children}
    </Tag>
  )
}

function Photo({ alt }: { alt: string }) {
  const [failed, setFailed] = useState(false)
  if (failed)
    return (
      <div className="photo photo--initials" role="img" aria-label={alt}>
        <span aria-hidden="true">PR</span>
      </div>
    )
  return <img className="photo" src="/foto.jpg" alt={alt} width={600} height={600} fetchPriority="high" onError={() => setFailed(true)} />
}

function SectionHead({ id, index, title, intro }: { id: string; index: string; title: string; intro?: string }) {
  return (
    <header className="section-head">
      <p className="section-head__index" aria-hidden="true">
        {index}
      </p>
      <h2 id={id}>{title}</h2>
      {intro && <p className="section-head__intro">{intro}</p>}
    </header>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [active, setActive] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
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

  // Barra de progreso de lectura y cabecera compacta al hacer scroll
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight
        progressRef.current?.style.setProperty('--progress', String(max > 0 ? scrollY / max : 0))
        setScrolled(scrollY > 24)
      })
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  // Sección activa en el menú
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    // La portada también se observa para que, al volver arriba, no quede ninguna sección marcada
    ;['top', ...SECTIONS.map((id) => `s-${id}`)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Aparición suave al entrar en pantalla (desactivada con prefers-reduced-motion vía CSS)
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
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))
    // Red de seguridad: si el observer no se dispara nunca (pestaña oculta, capturas), se muestra todo
    const fallback = window.setTimeout(() => {
      if (!fired) els.forEach((el) => el.classList.add('is-visible'))
    }, 2000)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      location.href = `mailto:${contact.email}`
    }
  }

  const navItems: [string, string][] = [
    ['sobre-mi', t.nav.about],
    ['experiencia', t.nav.experience],
    ['proyectos', t.nav.projects],
    ['stack', t.nav.skills],
    ['formacion', t.nav.education],
    ['contacto', t.nav.contact],
  ]
  const newTab = lang === 'es' ? '(se abre en otra pestaña)' : '(opens in a new tab)'

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipLink}
      </a>
      <div className="progress" ref={progressRef} aria-hidden="true" />

      {/* Fondo: brillos de color y una retícula muy suave */}
      <div className="backdrop" aria-hidden="true">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <span className="blob blob--3" />
        <span className="grid" />
        <span className="grain" />
      </div>

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container site-header__inner">
          <a className="brand" href="#top" aria-label="Pablo Rojo Hernández">
            <span className="brand__mark" aria-hidden="true">
              PR
            </span>
          </a>
          <nav aria-label={lang === 'es' ? 'Principal' : 'Main'} className="site-nav">
            <ul>
              {navItems.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} aria-current={active === `s-${id}` ? 'true' : undefined}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button type="button" className="lang-toggle" onClick={() => setLang(other)} aria-label={t.langToggle.label} lang={other}>
            <Icon name="globe" />
            <span>{t.langToggle.short}</span>
          </button>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* ── HERO ── */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container hero__inner">
            <div className="hero__text">
              <p className="status">
                <span className="status__dot" aria-hidden="true" />
                {t.hero.status}
              </p>
              <h1 id="hero-title" className="hero__name">
                <span className="hero__greeting">{t.hero.greeting}</span>
                <span className="hero__first">{t.hero.firstName}</span>
                <span className="hero__last">{t.hero.lastName}</span>
              </h1>
              <p className="hero__role">
                <span className="gradient-text">{t.hero.role}</span>
                <span className="hero__location">
                  <Icon name="pin" /> {t.hero.location}
                </span>
              </p>
              <p className="hero__pitch">{t.hero.pitch}</p>
              <div className="hero__ctas">
                <a className="btn btn--primary" href="#proyectos">
                  {t.hero.ctaProjects}
                  <Icon name="arrow-right" />
                </a>
                <a className="btn btn--ghost" href="#contacto">
                  {t.hero.ctaContact}
                </a>
              </div>
            </div>

            <div className="hero__visual">
              <div className="arch">
                <div className="arch__halo" aria-hidden="true" />
                <div className="arch__frame">
                  <Photo alt={t.hero.photoAlt} />
                </div>
                <span className="float float--1" aria-hidden="true">
                  Angular
                </span>
                <span className="float float--2" aria-hidden="true">
                  React
                </span>
                <span className="float float--3" aria-hidden="true">
                  Django
                </span>
                <span className="float float--4" aria-hidden="true">
                  Spring Boot
                </span>
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#sobre-mi" aria-label={t.hero.scroll}>
            <span>{t.hero.scroll}</span>
            <span className="scroll-cue__line" aria-hidden="true" />
          </a>
        </section>

        {/* ── CIFRAS ── */}
        <section className="container stats reveal" aria-label={lang === 'es' ? 'En cifras' : 'At a glance'}>
          {t.stats.map((s) => (
            <Card key={s.label} as="div" className="stat">
              <p className="stat__value gradient-text">{s.value}</p>
              <p className="stat__label">{s.label}</p>
            </Card>
          ))}
        </section>

        {/* ── CINTA DE TECNOLOGÍAS ── */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i}>
                {m}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>

        {/* ── SOBRE MÍ ── */}
        <section className="section" id="s-sobre-mi" aria-labelledby="sobre-mi">
          <div className="container about reveal">
            <SectionHead id="sobre-mi" index="01" title={t.about.title} />
            <div className="about__body">
              <p className="about__statement">{t.about.statement}</p>
              <div className="about__text">
                {t.about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <ul className="traits">
                  {t.about.traits.map((tr) => (
                    <li key={tr}>{tr}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCIA ── */}
        <section className="section" id="s-experiencia" aria-labelledby="experiencia">
          <div className="container reveal">
            <SectionHead id="experiencia" index="02" title={t.experience.title} />
            <ol className="timeline">
              {t.experience.items.map((item) => (
                <li key={item.role + item.period} className={`timeline__item ${item.current ? 'is-current' : ''}`}>
                  <span className="timeline__dot" aria-hidden="true" />
                  <Card as="div" className="timeline__card">
                    <div className="timeline__top">
                      <p className="timeline__period">{item.period}</p>
                      {item.current && <span className="pill">{t.experience.current}</span>}
                    </div>
                    <h3>{item.role}</h3>
                    <p className="timeline__company">
                      <Icon name="briefcase" /> {item.company}
                    </p>
                    <ul>
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── PROYECTOS ── */}
        <section className="section" id="s-proyectos" aria-labelledby="proyectos">
          <div className="container reveal">
            <SectionHead id="proyectos" index="03" title={t.projects.title} intro={t.projects.intro} />
            <div className="projects">
              {t.projects.items.map((p, i) => (
                <Card key={p.title} className="project">
                  <p className="project__index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  {p.kicker && <p className="project__kicker">{p.kicker}</p>}
                  <h3>{p.title}</h3>
                  <p className="project__desc">{p.description}</p>
                  <ul className="tags" aria-label={lang === 'es' ? 'Tecnologías' : 'Tech stack'}>
                    {p.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {p.link && (
                    <a className="project__link" href={p.link.href} target="_blank" rel="noopener noreferrer">
                      {p.link.label}
                      <Icon name="external" />
                      <span className="sr-only">{newTab}</span>
                    </a>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── STACK ── */}
        <section className="section" id="s-stack" aria-labelledby="stack">
          <div className="container reveal">
            <SectionHead id="stack" index="04" title={t.skills.title} intro={t.skills.intro} />
            <div className="stack">
              {t.skills.groups.map((g) => (
                <Card key={g.name} as="div" className="stack__group">
                  <h3>{g.name}</h3>
                  <ul className="chips">
                    {g.items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORMACIÓN + IDIOMAS ── */}
        <section className="section" id="s-formacion" aria-labelledby="formacion">
          <div className="container reveal">
            <SectionHead id="formacion" index="05" title={t.education.title} />
            <div className="education">
              <ul className="edu">
                {t.education.items.map((e) => (
                  <Card key={e.title} as="li" className="edu__item">
                    <span className="edu__icon" aria-hidden="true">
                      <Icon name="cap" />
                    </span>
                    <div>
                      <p className="edu__period">{e.period}</p>
                      <h3>{e.title}</h3>
                      <p className="edu__school">{e.school}</p>
                    </div>
                  </Card>
                ))}
              </ul>
              <Card as="div" className="languages">
                <h3>{t.education.languagesTitle}</h3>
                {t.education.languages.map((l) => (
                  <div key={l.name} className="lang">
                    <div className="lang__top">
                      <span className="lang__name">{l.name}</span>
                      <span className="lang__level">{l.level}</span>
                    </div>
                    {/* Escala europea A1–C2; el nativo llena la barra */}
                    <div className="cefr" role="img" aria-label={`${l.name}: ${l.level}`}>
                      {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl, i) => (
                        <span key={lvl} className={l.cefr === 0 || i < l.cefr ? 'on' : ''}>
                          {lvl}
                        </span>
                      ))}
                    </div>
                    <p className="lang__detail">{l.detail}</p>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </section>

        {/* ── CONTACTO ── */}
        <section className="section contact" id="s-contacto" aria-labelledby="contacto">
          <div className="container reveal">
            <Card as="div" className="contact__card">
              <p className="contact__eyebrow">{t.contactSection.eyebrow}</p>
              <h2 id="contacto" className="contact__title">
                <span className="gradient-text">{t.contactSection.title}</span>
              </h2>
              <p className="contact__text">{t.contactSection.text}</p>
              <p className="contact__email">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
              <div className="contact__actions">
                <a className="btn btn--primary" href={`mailto:${contact.email}`}>
                  <Icon name="mail" />
                  {t.contactSection.emailCta}
                </a>
                <button type="button" className="btn btn--ghost" onClick={copyEmail} aria-live="polite">
                  <Icon name={copied ? 'check' : 'copy'} />
                  {copied ? t.contactSection.copied : t.contactSection.copy}
                </button>
                <a className="btn btn--ghost" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <Icon name="linkedin" />
                  {t.contactSection.linkedinCta}
                  <span className="sr-only">{newTab}</span>
                </a>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>
            © {new Date().getFullYear()} {t.footer.rights} · <span className="muted">{t.footer.built}</span>
          </p>
          <a href="#top" className="to-top">
            {t.footer.top} <Icon name="arrow-up" />
          </a>
        </div>
      </footer>
    </>
  )
}
