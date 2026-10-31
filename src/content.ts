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

// Tecnologías de la cinta en movimiento y de la sección de habilidades
const skillsShared = {
  frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'React', 'Next.js'],
  backend: ['Node.js', 'Django (Python)', 'Spring Boot (Java)', 'PHP'],
  db: ['SQL', 'PostgreSQL'],
  other: ['Git', 'Moodle'],
}
export const marquee = ['Angular', 'React', 'Django', 'Spring Boot', 'TypeScript', 'Node.js', 'Next.js', 'PHP', 'PostgreSQL', 'Python', 'Java', 'Git']

export interface Project {
  title: string
  /** Contexto pequeño sobre el título (p. ej. «Grupo ASESSORA») */
  kicker?: string
  description: string
  tags: string[]
}

export interface Content {
  meta: { title: string; description: string }
  nav: { about: string; experience: string; projects: string; skills: string; education: string; contact: string }
  skipLink: string
  langToggle: { label: string; short: string }
  hero: {
    status: string
    greeting: string
    firstName: string
    lastName: string
    role: string
    location: string
    pitch: string
    ctaProjects: string
    ctaContact: string
    photoAlt: string
    scroll: string
  }
  stats: { value: string; label: string }[]
  about: { title: string; statement: string; paragraphs: string[]; traits: string[] }
  experience: {
    title: string
    current: string
    items: { role: string; company: string; period: string; bullets: string[]; current?: boolean }[]
  }
  projects: { title: string; intro: string; items: Project[] }
  skills: { title: string; intro: string; groups: { name: string; items: string[] }[] }
  education: {
    title: string
    items: { title: string; school: string; period: string }[]
    languagesTitle: string
    languages: { name: string; level: string; detail: string; /** 1–6 en la escala A1–C2; 0 = nativo */ cefr: number }[]
  }
  contactSection: {
    eyebrow: string
    title: string
    text: string
    emailCta: string
    copy: string
    copied: string
    linkedinCta: string
  }
  footer: { built: string; rights: string; top: string }
}

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
      skills: 'Stack',
      education: 'Formación',
      contact: 'Contacto',
    },
    skipLink: 'Saltar al contenido',
    langToggle: { label: 'Switch to English', short: 'EN' },
    hero: {
      status: 'Abierto a nuevas oportunidades',
      greeting: 'Hola, soy',
      firstName: 'Pablo',
      lastName: 'Rojo Hernández',
      role: 'Desarrollador de Aplicaciones Web',
      location: 'Sevilla, España',
      pitch: 'Construyo aplicaciones web completas, del backend a la interfaz, pensadas para resolver problemas reales.',
      ctaProjects: 'Ver proyectos',
      ctaContact: 'Hablemos',
      photoAlt: 'Retrato de Pablo Rojo Hernández',
      scroll: 'Desliza',
    },
    stats: [
      { value: '2+', label: 'años desarrollando en proyectos reales' },
      { value: 'Full-stack', label: 'del frontend a la base de datos' },
      { value: 'B2', label: 'de inglés · Cambridge First Certificate' },
    ],
    about: {
      title: 'Sobre mí',
      statement: 'Convierto necesidades reales en aplicaciones web que funcionan, se mantienen y crecen.',
      paragraphs: [
        'Soy desarrollador de aplicaciones web con experiencia en proyectos reales usando Angular, Spring Boot y Django.',
        'Me defino como una persona proactiva, resolutiva y comprometida con la mejora continua. Busco un entorno en el que pueda aportar valor desde el primer día y seguir creciendo como profesional.',
      ],
      traits: ['Proactivo', 'Resolutivo', 'Mejora continua', 'Trabajo en equipo'],
    },
    experience: {
      title: 'Experiencia',
      current: 'Actual',
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
      intro: 'Una selección de lo que he construido.',
      items: [
        {
          title: 'Gestión de Contenidos en la Nube',
          description:
            'Aplicación web para gestionar y almacenar contenidos en la nube, con una interfaz intuitiva y control de permisos según el tipo de usuario.',
          tags: ['Angular', 'Node.js'],
        },
        {
          title: 'Aplicación de Envío de Correos',
          description: 'Plataforma para redactar, almacenar y enviar correos de forma masiva, con autenticación y registro de envíos.',
          tags: ['Django', 'Python'],
        },
        {
          kicker: 'Grupo ASESSORA',
          title: 'Plugins para Moodle',
          description:
            'Desarrollo y mantenimiento de plugins personalizados para Moodle, adaptados a la gestión educativa y la formación online.',
          tags: ['PHP', 'Moodle'],
        },
        {
          kicker: 'Grupo ASESSORA',
          title: 'Normattivo',
          description: 'Creación de páginas en React con una pasarela de pago integrada.',
          tags: ['React', 'Pasarela de pago'],
        },
      ],
    },
    skills: {
      title: 'Stack',
      intro: 'Las herramientas con las que trabajo cada día.',
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
        { title: 'Grado Superior en Desarrollo de Aplicaciones Web', school: 'IES Julio Verne · Sevilla', period: '2022 – 2024' },
        { title: 'Bachillerato Tecnológico', school: 'IES Isbilya · Sevilla', period: '2019 – 2021' },
      ],
      languagesTitle: 'Idiomas',
      languages: [
        { name: 'Español', level: 'Nativo', detail: 'Lengua materna', cefr: 0 },
        { name: 'Inglés', level: 'B2', detail: 'First Certificate · Cambridge', cefr: 4 },
      ],
    },
    contactSection: {
      eyebrow: 'Contacto',
      title: '¿Hablamos?',
      text: '¿Tienes un proyecto, una oferta o simplemente quieres hablar? Escríbeme y te responderé lo antes posible.',
      emailCta: 'Escríbeme',
      copy: 'Copiar email',
      copied: '¡Copiado!',
      linkedinCta: 'LinkedIn',
    },
    footer: { built: 'Diseñado y desarrollado en Sevilla.', rights: 'Pablo Rojo Hernández', top: 'Volver arriba' },
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
      skills: 'Stack',
      education: 'Education',
      contact: 'Contact',
    },
    skipLink: 'Skip to content',
    langToggle: { label: 'Cambiar a español', short: 'ES' },
    hero: {
      status: 'Open to new opportunities',
      greeting: "Hi, I'm",
      firstName: 'Pablo',
      lastName: 'Rojo Hernández',
      role: 'Web Application Developer',
      location: 'Seville, Spain',
      pitch: 'I build complete web applications, from the backend to the interface, designed to solve real problems.',
      ctaProjects: 'See my work',
      ctaContact: "Let's talk",
      photoAlt: 'Portrait of Pablo Rojo Hernández',
      scroll: 'Scroll',
    },
    stats: [
      { value: '2+', label: 'years building real-world projects' },
      { value: 'Full-stack', label: 'from the frontend to the database' },
      { value: 'B2', label: 'English · Cambridge First Certificate' },
    ],
    about: {
      title: 'About me',
      statement: 'I turn real needs into web applications that work, last and grow.',
      paragraphs: [
        "I'm a web application developer with hands-on experience on real projects using Angular, Spring Boot and Django.",
        "I'm proactive, solution-oriented and committed to continuous improvement. I'm looking for a team where I can add value from day one and keep growing as a professional.",
      ],
      traits: ['Proactive', 'Problem solver', 'Continuous improvement', 'Team player'],
    },
    experience: {
      title: 'Experience',
      current: 'Current',
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
      intro: "A selection of things I've built.",
      items: [
        {
          title: 'Cloud Content Manager',
          description: 'A web app for managing and storing content in the cloud, with an intuitive interface and role-based permissions.',
          tags: ['Angular', 'Node.js'],
        },
        {
          title: 'Bulk Email Sender',
          description: 'A platform to write, store and send emails in bulk, with authentication and a full send log.',
          tags: ['Django', 'Python'],
        },
        {
          kicker: 'Grupo ASESSORA',
          title: 'Moodle Plugins',
          description: 'Building and maintaining custom Moodle plugins tailored to educational management and online training.',
          tags: ['PHP', 'Moodle'],
        },
        {
          kicker: 'Grupo ASESSORA',
          title: 'Normattivo',
          description: 'Building React pages with an integrated payment gateway.',
          tags: ['React', 'Payment gateway'],
        },
      ],
    },
    skills: {
      title: 'Stack',
      intro: 'The tools I work with every day.',
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
        { title: 'Higher Vocational Diploma in Web Application Development', school: 'IES Julio Verne · Seville', period: '2022 – 2024' },
        { title: 'High School Diploma, Science & Technology track', school: 'IES Isbilya · Seville', period: '2019 – 2021' },
      ],
      languagesTitle: 'Languages',
      languages: [
        { name: 'Spanish', level: 'Native', detail: 'Mother tongue', cefr: 0 },
        { name: 'English', level: 'B2', detail: 'First Certificate · Cambridge', cefr: 4 },
      ],
    },
    contactSection: {
      eyebrow: 'Contact',
      title: "Let's talk",
      text: "Got a project, a job opening or just want to chat? Drop me a line and I'll get back to you soon.",
      emailCta: 'Email me',
      copy: 'Copy email',
      copied: 'Copied!',
      linkedinCta: 'LinkedIn',
    },
    footer: { built: 'Designed and built in Seville.', rights: 'Pablo Rojo Hernández', top: 'Back to top' },
  },
}
