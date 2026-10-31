import { useEffect, useRef, useState, type FormEvent, type PointerEvent, type ReactNode } from 'react'
import { WEB3FORMS_KEY, contact, content, marquee, type Content, type Lang, type Project } from './content'
import { Icon } from './icons'

const STORAGE_KEY = 'lang'
const SECTIONS = ['sobre-mi', 'experiencia', 'proyectos', 'stack', 'formacion', 'contacto'] as const
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

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

// Ventana de editor/terminal con su barra de título
function Window({ title, className = '', children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={`window ${className}`}>
      <div className="window__bar" aria-hidden="true">
        <span className="window__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="window__title">{title}</span>
      </div>
      {children}
    </div>
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

// Terminal que escribe sus comandos uno a uno (todo visible de golpe si se reduce el movimiento)
function Terminal({ lines }: { lines: Content['hero']['terminal'] }) {
  // shown = líneas ya completas; chars = letras escritas de la línea en curso
  const [shown, setShown] = useState(0)
  const [chars, setChars] = useState(0)

  useEffect(() => {
    if (reducedMotion()) {
      setShown(lines.length)
      return
    }
    setShown(0)
    setChars(0)
    let line = 0
    let c = 0
    let timer = 0
    const tick = () => {
      if (line >= lines.length) return
      if (c < lines[line].cmd.length) {
        c++
        setChars(c)
        timer = window.setTimeout(tick, 55 + Math.random() * 60)
      } else {
        line++
        c = 0
        setShown(line)
        setChars(0)
        timer = window.setTimeout(tick, 650)
      }
    }
    timer = window.setTimeout(tick, 700)
    return () => window.clearTimeout(timer)
  }, [lines])

  const typing = shown < lines.length ? lines[shown] : null
  return (
    <Window title="zsh — ~/pablo" className="terminal">
      <div className="terminal__body" role="img" aria-label={lines.map((l) => `${l.cmd}: ${l.out}`).join('. ')}>
        {lines.slice(0, shown).map((l) => (
          <div key={l.cmd}>
            <p>
              <span className="t-prompt">❯</span> <span className="t-cmd">{l.cmd}</span>
            </p>
            <p className="t-out">{l.out}</p>
          </div>
        ))}
        <p>
          <span className="t-prompt">❯</span> {typing && <span className="t-cmd">{typing.cmd.slice(0, chars)}</span>}
          <span className="caret" />
        </p>
      </div>
    </Window>
  )
}

// Ficha en forma de código TypeScript
function ProfileCode({ lang, t }: { lang: Lang; t: Content }) {
  const es = lang === 'es'
  const K = ({ children }: { children: string }) => <span className="c-key">{children}</span>
  const S = ({ children }: { children: string }) => <span className="c-str">'{children}'</span>
  return (
    <Window title="pablo.ts" className="code">
      <pre className="code__body">
        <code>
          <span className="c-kw">const</span> <span className="c-var">pablo</span> = {'{\n'}
          {'  '}
          <K>{es ? 'rol' : 'role'}</K>: <S>{t.hero.role}</S>,{'\n'}
          {'  '}
          <K>{es ? 'ubicacion' : 'location'}</K>: <S>{t.hero.location}</S>,{'\n'}
          {'  '}
          <K>{es ? 'experiencia' : 'experience'}</K>: <S>{es ? '2+ años' : '2+ years'}</S>,{'\n'}
          {'  '}
          <K>{es ? 'enfoque' : 'focus'}</K>: [<S>frontend</S>, <S>backend</S>, <S>{es ? 'bases de datos' : 'databases'}</S>],{'\n'}
          {'  '}
          <K>{es ? 'idiomas' : 'languages'}</K>: {'{ '}
          <K>es</K>: <S>{es ? 'nativo' : 'native'}</S>, <K>en</K>: <S>B2</S>
          {' },\n'}
          {'  '}
          <K>{es ? 'disponible' : 'available'}</K>: <span className="c-bool">true</span>,{'\n'}
          {'}'}
        </code>
      </pre>
    </Window>
  )
}

// stack.json con las tecnologías agrupadas
function StackJson({ groups }: { groups: Content['skills']['groups'] }) {
  return (
    <Window title="stack.json" className="code code--stack">
      <pre className="code__body">
        <code>
          {'{\n'}
          {groups.map((g, gi) => (
            <span key={g.name}>
              {'  '}
              <span className="c-key">"{g.name}"</span>: [
              {g.items.map((it, i) => (
                <span key={it}>
                  <span className="c-str">"{it}"</span>
                  {i < g.items.length - 1 ? ', ' : ''}
                </span>
              ))}
              ]{gi < groups.length - 1 ? ',' : ''}
              {'\n'}
            </span>
          ))}
          {'}'}
        </code>
      </pre>
    </Window>
  )
}

// Diagrama de arquitectura de TopClubs con «paquetes» de datos viajando por los cables
function Architecture({ p, lang }: { p: Project; lang: Lang }) {
  const es = lang === 'es'
  const modules = p.modules ?? []
  const api = modules[0]
  const clients = modules.slice(1)
  const cy = (i: number) => 52 + i * 78
  const apiY = 172
  const toApi = (i: number) => `M178 ${cy(i)} C 214 ${cy(i)}, 214 ${apiY}, 246 ${apiY}`
  const toData = [`M374 ${apiY} C 400 ${apiY}, 400 112, 424 112`, `M374 ${apiY} C 400 ${apiY}, 400 232, 424 232`]
  return (
    <figure className="arch">
      <svg viewBox="0 0 560 344" role="img" aria-labelledby="arch-title">
        <title id="arch-title">{es ? 'Arquitectura de TopClubs: apps y paneles conectados a la API, que usa MySQL y S3' : 'TopClubs architecture: apps and dashboards connected to the API, which uses MySQL and S3'}</title>
        <text className="arch__cap" x="20" y="18">
          {es ? '// clientes' : '// clients'}
        </text>
        <text className="arch__cap" x="246" y="18">
          // api
        </text>
        <text className="arch__cap" x="424" y="18">
          {es ? '// datos' : '// data'}
        </text>

        {[...clients.map((_, i) => toApi(i)), ...toData].map((d, i) => (
          <g key={d}>
            <path d={d} className="arch__wire" />
            <circle r="3.2" className="arch__packet">
              <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        ))}

        {clients.map((m, i) => (
          <g key={m.name} transform={`translate(20 ${cy(i) - 26})`}>
            <rect width="158" height="52" rx="12" className="arch__node" />
            <text x="14" y="23" className="arch__name">
              {m.name}
            </text>
            <text x="14" y="40" className="arch__detail">
              {m.detail}
            </text>
          </g>
        ))}

        <g transform={`translate(246 ${apiY - 44})`}>
          <rect width="128" height="88" rx="16" className="arch__node arch__node--core" />
          <text x="64" y="40" textAnchor="middle" className="arch__name arch__name--core">
            {api?.name ?? 'API'}
          </text>
          <text x="64" y="60" textAnchor="middle" className="arch__detail">
            NestJS
          </text>
        </g>

        {[
          { y: 112, name: 'MySQL', detail: es ? 'base de datos' : 'database' },
          { y: 232, name: 'S3', detail: es ? 'archivos' : 'files' },
        ].map((d) => (
          <g key={d.name} transform={`translate(424 ${d.y - 26})`}>
            <rect width="116" height="52" rx="12" className="arch__node arch__node--data" />
            <text x="14" y="23" className="arch__name">
              {d.name}
            </text>
            <text x="14" y="40" className="arch__detail">
              {d.detail}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}

function Featured({ p, t, lang, newTab }: { p: Project; t: Content; lang: Lang; newTab: string }) {
  return (
    <Card className="featured">
      <div className="featured__text">
        <p className="mono-label">
          <span className="accent">01</span> · {p.kicker}
        </p>
        <h3 className="featured__title">{p.title}</h3>
        <p className="featured__desc">{p.description}</p>
        <ul className="tags" aria-label={lang === 'es' ? 'Tecnologías' : 'Tech stack'}>
          {p.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {p.link && (
          <a className="btn btn--primary featured__cta" href={p.link.href} target="_blank" rel="noopener noreferrer">
            {t.projects.visit} {p.link.label}
            <Icon name="external" />
            <span className="sr-only">{newTab}</span>
          </a>
        )}
      </div>
      <div className="featured__visual">
        <p className="mono-label">{t.projects.builtWith}</p>
        <Architecture p={p} lang={lang} />
      </div>
    </Card>
  )
}

type FormState = 'idle' | 'sending' | 'ok' | 'error'

function ContactForm({ t }: { t: Content['contactSection']['form'] }) {
  const [state, setState] = useState<FormState>('idle')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('botcheck')) return // relleno por un bot
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')
    // Sin clave de Web3Forms: abre el correo del visitante con el mensaje ya escrito
    if (!WEB3FORMS_KEY) {
      const body = `${message}\n\n— ${name} (${email})`
      location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Contacto web · ${name}`)}&body=${encodeURIComponent(body)}`
      return
    }
    setState('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Nuevo mensaje desde rojohernandezpablo.com · ${name}`,
          from_name: 'rojohernandezpablo.com',
          name,
          email,
          message,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { success?: boolean }
      if (!res.ok || !json.success) throw new Error()
      setState('ok')
      form.reset()
    } catch {
      setState('error')
    }
  }

  return (
    <Window title="nuevo-mensaje.sh" className="form-window">
      <form className="form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">{t.name}</span>
          <input name="name" autoComplete="name" required maxLength={100} placeholder={t.namePh} />
        </label>
        <label className="field">
          <span className="field__label">{t.email}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={150} placeholder={t.emailPh} />
        </label>
        <label className="field">
          <span className="field__label">{t.message}</span>
          <textarea name="message" required rows={5} maxLength={4000} placeholder={t.messagePh} />
        </label>
        {/* Trampa para bots: invisible para las personas */}
        <input type="checkbox" name="botcheck" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="form__footer">
          <p className="form__privacy">{t.privacy}</p>
          <button className="btn btn--primary" disabled={state === 'sending'}>
            {state === 'sending' ? t.sending : t.send}
            <Icon name="send" />
          </button>
        </div>
        <p className="form__status" role="status" aria-live="polite">
          {state === 'ok' && <span className="ok">✓ {t.ok}</span>}
          {state === 'error' && (
            <span className="err">
              {t.error} <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </span>
          )}
        </p>
      </form>
    </Window>
  )
}

function SectionHead({ id, index, file, title, intro }: { id: string; index: string; file: string; title: string; intro?: string }) {
  return (
    <header className="section-head">
      <p className="mono-label" aria-hidden="true">
        <span className="accent">{index}</span> // {file}
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

  // Sección activa en el menú; la portada también cuenta para que arriba no quede ninguna marcada
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
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
  const featured = t.projects.items.filter((p) => p.featured)
  const others = t.projects.items.filter((p) => !p.featured)

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipLink}
      </a>
      <div className="progress" ref={progressRef} aria-hidden="true" />

      {/* Fondo: nebulosas de color muy tenues y una retícula técnica */}
      <div className="backdrop" aria-hidden="true">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <span className="blob blob--3" />
        <span className="grid" />
      </div>

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container site-header__inner">
          <a className="brand" href="#top" aria-label="Pablo Rojo Hernández">
            <span className="brand__mark" aria-hidden="true">
              <span className="accent">~/</span>pablo
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
              <Window title="pablo.jpg" className="photo-window">
                <Photo alt={t.hero.photoAlt} />
              </Window>
              <Terminal lines={t.hero.terminal} />
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
              <p className="stat__value">{s.value}</p>
              <p className="stat__label">{s.label}</p>
            </Card>
          ))}
        </section>

        {/* ── CINTA DE TECNOLOGÍAS ── */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i}>
                <i>{'<'}</i>
                {m}
                <i>{' />'}</i>
              </span>
            ))}
          </div>
        </div>

        {/* ── SOBRE MÍ ── */}
        <section className="section" id="s-sobre-mi" aria-labelledby="sobre-mi">
          <div className="container reveal">
            <SectionHead id="sobre-mi" index="01" file={lang === 'es' ? 'sobre-mi.md' : 'about.md'} title={t.about.title} />
            <div className="about__body">
              <div>
                <p className="about__statement">{t.about.statement}</p>
                <div className="about__text">
                  {t.about.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <ul className="traits">
                  {t.about.traits.map((tr) => (
                    <li key={tr}>{tr}</li>
                  ))}
                </ul>
              </div>
              <ProfileCode lang={lang} t={t} />
            </div>
          </div>
        </section>

        {/* ── EXPERIENCIA ── */}
        <section className="section" id="s-experiencia" aria-labelledby="experiencia">
          <div className="container reveal">
            <SectionHead id="experiencia" index="02" file="git log" title={t.experience.title} />
            <ol className="timeline">
              {t.experience.items.map((item) => (
                <li key={item.role + item.period} className={`timeline__item ${item.current ? 'is-current' : ''}`}>
                  <span className="timeline__dot" aria-hidden="true" />
                  <Card as="div" className="timeline__card">
                    <div className="timeline__top">
                      <p className="timeline__period">{item.period}</p>
                      {item.current && <span className="pill">HEAD · {t.experience.current}</span>}
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
            <SectionHead id="proyectos" index="03" file={lang === 'es' ? 'proyectos/' : 'projects/'} title={t.projects.title} intro={t.projects.intro} />
            {featured.map((p) => (
              <Featured key={p.title} p={p} t={t} lang={lang} newTab={newTab} />
            ))}
            <div className="projects">
              {others.map((p, i) => (
                <Card key={p.title} className="project">
                  <div className="project__bar" aria-hidden="true">
                    <span className="window__dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="project__path">
                      ~/{lang === 'es' ? 'proyectos' : 'projects'}/{p.slug}
                    </span>
                  </div>
                  <div className="project__body">
                    <div className="project__top">
                      <span className="project__icon" aria-hidden="true">
                        <Icon name={p.icon ?? 'cloud'} />
                      </span>
                      <span className="project__index" aria-hidden="true">
                        {String(i + 2).padStart(2, '0')}
                      </span>
                    </div>
                    {p.kicker && <p className="project__kicker">{p.kicker}</p>}
                    <h3>{p.title}</h3>
                    <p className="project__desc">{p.description}</p>
                    <ul className="tags" aria-label={lang === 'es' ? 'Tecnologías' : 'Tech stack'}>
                      {p.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── STACK ── */}
        <section className="section" id="s-stack" aria-labelledby="stack">
          <div className="container reveal">
            <SectionHead id="stack" index="04" file="stack.json" title={t.skills.title} intro={t.skills.intro} />
            <StackJson groups={t.skills.groups} />
          </div>
        </section>

        {/* ── FORMACIÓN + IDIOMAS ── */}
        <section className="section" id="s-formacion" aria-labelledby="formacion">
          <div className="container reveal">
            <SectionHead id="formacion" index="05" file={lang === 'es' ? 'formacion.md' : 'education.md'} title={t.education.title} />
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
            <div className="contact__grid">
              <div className="contact__intro">
                <p className="mono-label">
                  <span className="accent">06</span> // {t.contactSection.eyebrow.toLowerCase()}
                </p>
                <h2 id="contacto" className="contact__title">
                  <span className="gradient-text">{t.contactSection.title}</span>
                </h2>
                <p className="contact__text">{t.contactSection.text}</p>
                <ul className="contact__links">
                  <li>
                    <a href={`mailto:${contact.email}`}>
                      <Icon name="mail" /> {contact.email}
                    </a>
                    <button type="button" className="copy-btn" onClick={copyEmail} aria-live="polite">
                      <Icon name={copied ? 'check' : 'copy'} />
                      <span>{copied ? t.contactSection.copied : t.contactSection.copy}</span>
                    </button>
                  </li>
                  <li>
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                      <Icon name="linkedin" /> {contact.linkedinLabel}
                      <span className="sr-only">{newTab}</span>
                    </a>
                  </li>
                </ul>
              </div>
              <ContactForm t={t.contactSection.form} />
            </div>
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
