// ─────────────────────────────────────────────────────────────
//  TODO EL TEXTO DE LA WEB ESTÁ AQUÍ.
//  Edita `es` (español) y `en` (inglés). Ambos objetos deben
//  tener la misma forma; TypeScript te avisará si falta algo.
// ─────────────────────────────────────────────────────────────

export type Lang = 'es' | 'en'

export const contact = {
  email: 'rojohernandezpablo@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pablorojohdez',
  linkedinLabel: 'linkedin.com/in/pablorojohdez',
}

export interface Project {
  title: string
  description: string
  tags: string[]
  /** Etiqueta pequeña sobre el título (p. ej. «Proyecto personal») */
  kicker?: string
  /** Lista de detalles opcional */
  bullets?: string[]
  link?: { href: string; label: string; note?: string }
}

export interface Content {
  meta: { title: string; description: string }
  nav: { about: string; experience: string; projects: string; skills: string; education: string; contact: string }
  skipLink: string
  langToggle: { label: string; short: string }
  hero: {
    greeting: string
    name: string
    role: string
    location: string
    pitch: string
    ctaProjects: string
    ctaContact: string
    photoAlt: string
  }
  about: { title: string; paragraphs: string[]; highlights: { value: string; label: string }[] }
  experience: {
    title: string
    items: { role: string; company: string; period: string; bullets: string[]; current?: boolean }[]
  }
  projects: { title: string; intro: string; items: Project[] }
  skills: { title: string; groups: { name: string; items: string[] }[] }
  education: {
    title: string
    items: { title: string; school: string; period: string }[]
    languagesTitle: string
    languages: { name: string; level: string }[]
  }
  contactSection: {
    title: string
    text: string
    emailCta: string
    linkedinCta: string
  }
  footer: { built: string; rights: string }
}

const skillsShared = {
  frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'React', 'Next.js'],
  backend: ['Node.js', 'Django (Python)', 'Spring Boot (Java)', 'PHP'],
  db: ['SQL', 'PostgreSQL'],
  other: ['Git', 'Moodle', 'Cloudflare Workers'],
}

const dashboardUrl = 'https://dashboard.rojohernandezpablo.com'

export const content: Record<Lang, Content> = {
  es: {
    meta: {
      title: 'Pablo Rojo Hernández · Desarrollador de Aplicaciones Web en Sevilla',
      description:
        'Portfolio de Pablo Rojo Hernández, desarrollador de aplicaciones web en Sevilla. Angular, React, Django, Spring Boot y PHP en proyectos reales.',
    },
    nav: {
      about: 'Sobre mí',
      experience: 'Experiencia',
      projects: 'Proyectos',
      skills: 'Habilidades',
      education: 'Formación',
      contact: 'Contacto',
    },
    skipLink: 'Saltar al contenido',
    langToggle: { label: 'Switch to English', short: 'EN' },
    hero: {
      greeting: 'Hola, soy',
      name: 'Pablo Rojo Hernández',
      role: 'Desarrollador de Aplicaciones Web',
      location: 'Sevilla, España',
      pitch: 'Construyo aplicaciones web completas, del backend a la interfaz, pensadas para resolver problemas reales.',
      ctaProjects: 'Ver proyectos',
      ctaContact: 'Contactar',
      photoAlt: 'Retrato de Pablo Rojo Hernández',
    },
    about: {
      title: 'Sobre mí',
      paragraphs: [
        'Soy desarrollador de aplicaciones web con experiencia en proyectos reales usando Angular, Spring Boot y Django.',
        'Me defino como una persona proactiva, resolutiva y comprometida con la mejora continua. Busco un entorno en el que pueda aportar valor desde el primer día y seguir creciendo como profesional.',
      ],
      highlights: [
        { value: '2024', label: 'Desarrollando en Grupo ASESSORA' },
        { value: 'Full-stack', label: 'Frontend, backend y bases de datos' },
        { value: 'B2', label: 'Inglés · Cambridge First Certificate' },
      ],
    },
    experience: {
      title: 'Experiencia',
      items: [
        {
          role: 'Desarrollador de aplicaciones web',
          company: 'Grupo ASESSORA',
          period: 'Julio 2024 – actualidad',
          current: true,
          bullets: [
            'Desarrollo de aplicaciones web con Django, Angular, PHP y otras tecnologías.',
            'Funcionalidades de backend y frontend en plataformas de formación y de gestión interna.',
            'Mantenimiento y evolución de plugins y módulos para sistemas de gestión educativa (Moodle).',
            'Gestión de plataformas de cursos: publicación de contenidos, seguimiento de usuarios y resolución de incidencias.',
            'Creación de páginas en React con pasarelas de pago (proyecto Normattivo).',
          ],
        },
        {
          role: 'Prácticas FCT',
          company: 'Grupo ASESSORA',
          period: '2024',
          bullets: ['Formación en centros de trabajo del Grado Superior en Desarrollo de Aplicaciones Web.'],
        },
      ],
    },
    projects: {
      title: 'Proyectos',
      intro: 'Una selección de lo que he construido, en el trabajo y por mi cuenta.',
      items: [
        {
          kicker: 'Proyecto personal',
          title: 'Panel personal «Mis apps»',
          description:
            'Un panel privado con inicio de sesión que reúne mis propias mini-aplicaciones, desplegado en el edge de Cloudflare.',
          bullets: [
            'Gestión de mi sección de la Banda de Cornetas y Tambores Las Cigarreras (Sevilla): asistencia, convocatorias con rotación justa, subgrupos por marcha, formaciones e imágenes para compartir con el escudo de la banda.',
            'Registro de gimnasio para dos personas: series, repeticiones y kilos, gráficas de progreso y medidas corporales.',
            'Autenticación propia con PBKDF2 y permisos por aplicación.',
          ],
          tags: ['React', 'TypeScript', 'Hono', 'Cloudflare Workers', 'Cloudflare D1 (SQLite)'],
          link: { href: dashboardUrl, label: 'dashboard.rojohernandezpablo.com', note: 'Privado · requiere inicio de sesión' },
        },
        {
          title: 'Gestión de Contenidos en la Nube',
          description:
            'Aplicación web para gestionar y almacenar contenidos en la nube, con una interfaz intuitiva y control de permisos según el tipo de usuario.',
          tags: ['Angular', 'Node.js'],
        },
        {
          title: 'Aplicación de Envío de Correos',
          description:
            'Plataforma para redactar, almacenar y enviar correos de forma masiva, con autenticación y registro de envíos.',
          tags: ['Django', 'Python'],
        },
        {
          title: 'Plugins para Moodle',
          description:
            'Desarrollo y mantenimiento de plugins personalizados para Moodle, adaptados a la gestión educativa y la formación online.',
          tags: ['PHP', 'Moodle'],
        },
      ],
    },
    skills: {
      title: 'Habilidades',
      groups: [
        { name: 'Frontend', items: skillsShared.frontend },
        { name: 'Backend', items: skillsShared.backend },
        { name: 'Bases de datos', items: skillsShared.db },
        { name: 'Otros', items: skillsShared.other },
      ],
    },
    education: {
      title: 'Formación',
      items: [
        {
          title: 'Grado Superior en Desarrollo de Aplicaciones Web',
          school: 'IES Julio Verne · Sevilla',
          period: '2022 – 2024',
        },
        { title: 'Bachillerato Tecnológico', school: 'IES Isbilya · Sevilla', period: '2019 – 2021' },
      ],
      languagesTitle: 'Idiomas',
      languages: [
        { name: 'Español', level: 'Nativo' },
        { name: 'Inglés', level: 'B2 · First Certificate (Cambridge)' },
      ],
    },
    contactSection: {
      title: 'Contacto',
      text: '¿Tienes un proyecto, una oferta o simplemente quieres hablar? Escríbeme y te responderé lo antes posible.',
      emailCta: 'Escríbeme',
      linkedinCta: 'LinkedIn',
    },
    footer: { built: 'Hecho con React y TypeScript en Sevilla.', rights: 'Pablo Rojo Hernández' },
  },

  en: {
    meta: {
      title: 'Pablo Rojo Hernández · Web Developer in Seville',
      description:
        'Portfolio of Pablo Rojo Hernández, a web developer based in Seville, Spain. Angular, React, Django, Spring Boot and PHP on real-world projects.',
    },
    nav: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
    },
    skipLink: 'Skip to content',
    langToggle: { label: 'Cambiar a español', short: 'ES' },
    hero: {
      greeting: "Hi, I'm",
      name: 'Pablo Rojo Hernández',
      role: 'Web Application Developer',
      location: 'Seville, Spain',
      pitch: 'I build complete web applications, from the backend to the interface, designed to solve real problems.',
      ctaProjects: 'See my work',
      ctaContact: 'Get in touch',
      photoAlt: 'Portrait of Pablo Rojo Hernández',
    },
    about: {
      title: 'About me',
      paragraphs: [
        "I'm a web application developer with hands-on experience on real projects using Angular, Spring Boot and Django.",
        "I'm proactive, solution-oriented and committed to continuous improvement. I'm looking for a team where I can add value from day one and keep growing as a professional.",
      ],
      highlights: [
        { value: '2024', label: 'Building software at Grupo ASESSORA' },
        { value: 'Full-stack', label: 'Frontend, backend and databases' },
        { value: 'B2', label: 'English · Cambridge First Certificate' },
      ],
    },
    experience: {
      title: 'Experience',
      items: [
        {
          role: 'Web Application Developer',
          company: 'Grupo ASESSORA',
          period: 'July 2024 – present',
          current: true,
          bullets: [
            'Building web applications with Django, Angular, PHP and other technologies.',
            'Shipping backend and frontend features for e-learning and internal management platforms.',
            'Maintaining and extending plugins and modules for learning management systems (Moodle).',
            'Running course platforms: publishing content, tracking learners and resolving support issues.',
            'Building React pages with integrated payment gateways (Normattivo project).',
          ],
        },
        {
          role: 'Work placement (FCT)',
          company: 'Grupo ASESSORA',
          period: '2024',
          bullets: ['On-the-job training as part of my Higher Vocational Diploma in Web Application Development.'],
        },
      ],
    },
    projects: {
      title: 'Projects',
      intro: "A selection of things I've built, both at work and on my own.",
      items: [
        {
          kicker: 'Personal project',
          title: '“Mis apps” personal dashboard',
          description:
            'A private, login-protected dashboard that hosts my own mini-apps, running on Cloudflare’s edge network.',
          bullets: [
            'Section manager for the Las Cigarreras marching band (Banda de Cornetas y Tambores, Seville): attendance, call-ups with fair rotation, per-march sub-groups, formation layouts and shareable images featuring the band crest.',
            'Gym tracker for two people: sets, reps and weights, progress charts and body measurements.',
            'Custom PBKDF2 authentication with per-app permissions.',
          ],
          tags: ['React', 'TypeScript', 'Hono', 'Cloudflare Workers', 'Cloudflare D1 (SQLite)'],
          link: { href: dashboardUrl, label: 'dashboard.rojohernandezpablo.com', note: 'Private · login required' },
        },
        {
          title: 'Cloud Content Manager',
          description:
            'A web app for managing and storing content in the cloud, with an intuitive interface and role-based permissions.',
          tags: ['Angular', 'Node.js'],
        },
        {
          title: 'Bulk Email Sender',
          description: 'A platform to write, store and send emails in bulk, with authentication and a full send log.',
          tags: ['Django', 'Python'],
        },
        {
          title: 'Moodle Plugins',
          description:
            'Building and maintaining custom Moodle plugins tailored to educational management and online training.',
          tags: ['PHP', 'Moodle'],
        },
      ],
    },
    skills: {
      title: 'Skills',
      groups: [
        { name: 'Frontend', items: skillsShared.frontend },
        { name: 'Backend', items: skillsShared.backend },
        { name: 'Databases', items: skillsShared.db },
        { name: 'Other', items: skillsShared.other },
      ],
    },
    education: {
      title: 'Education',
      items: [
        {
          title: 'Higher Vocational Diploma in Web Application Development',
          school: 'IES Julio Verne · Seville',
          period: '2022 – 2024',
        },
        { title: 'High School Diploma, Science & Technology track', school: 'IES Isbilya · Seville', period: '2019 – 2021' },
      ],
      languagesTitle: 'Languages',
      languages: [
        { name: 'Spanish', level: 'Native' },
        { name: 'English', level: 'B2 · First Certificate (Cambridge)' },
      ],
    },
    contactSection: {
      title: 'Contact',
      text: "Got a project, a job opening or just want to chat? Drop me a line and I'll get back to you soon.",
      emailCta: 'Email me',
      linkedinCta: 'LinkedIn',
    },
    footer: { built: 'Built with React and TypeScript in Seville.', rights: 'Pablo Rojo Hernández' },
  },
}
