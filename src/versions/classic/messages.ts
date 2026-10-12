// Messages for the classic (v1) version, namespaced under `classic.` in i18n.

const es = {
  nav: {
    work: 'Proyectos',
    services: 'Servicios',
    process: 'Cómo trabajo',
    contact: 'Contacto',
    letsTalk: 'Cuéntame tu idea →',
  },
  hero: {
    available: 'Apps y automatizaciones para dueños de negocio · Ecuador y LatAm',
    greeting: 'Hola, soy Diego Reyes, aka',
    title: 'Tu negocio, en piloto automático.',
    desc: 'Construyo el software que tu negocio necesita para <strong>vender más y trabajar menos</strong>: apps internas, bots de WhatsApp con IA, tiendas online y dashboards. Soy CTO de Bakano, donde ya ayudamos a <strong>más de 150 negocios</strong>.',
    cta: 'Cuéntame tu idea',
    seeWork: 'Ver proyectos',
    stats: {
      projects: 'Proyectos entregados',
      businesses: 'Negocios con Bakano',
      years: 'Años construyendo',
      reply: 'Tiempo de respuesta',
    },
  },
  pains: {
    eyebrow: '¿Te suena?',
    title: 'Si tu negocio se ve así,',
    titleAccent: 'puedo ayudarte',
    items: [
      { icon: 'fa-solid fa-pen-to-square', color: '#f59e0b', pain: 'Los pedidos llegan por WhatsApp y alguien los anota a mano.', fix: 'Un sistema que los recibe, ordena y avisa a cada área.' },
      { icon: 'fa-solid fa-chart-line', color: '#06d6a0', pain: 'No sabes cuánto vendiste hoy hasta que alguien arma el Excel.', fix: 'Un dashboard con tus ventas y metas en tiempo real.' },
      { icon: 'fa-solid fa-arrows-rotate', color: '#a78bfa', pain: 'Tu equipo repite las mismas tareas todos los días.', fix: 'Automatizaciones que las hacen solas, sin errores.' },
      { icon: 'fa-solid fa-moon', color: '#60a5fa', pain: 'Pierdes clientes que escriben fuera de horario.', fix: 'Un bot de WhatsApp con IA que responde y vende 24/7.' },
    ],
  },
  services: {
    eyebrow: 'Lo que construyo',
    title: 'Software que se',
    titleAccent: 'paga solo',
    subtitle: 'No vendo horas de código. Vendo que tu operación funcione sin ti encima.',
    projects: 'proyectos',
  },
  projects: {
    eyebrow: 'Portafolio real',
    title: 'Negocios que ya',
    titleAccent: 'trabajan conmigo',
    subtitle: 'Cada uno está en producción, usado todos los días por dueños de negocio como tú. Filtra por lo que necesitas.',
  },
  process: {
    eyebrow: 'Cómo trabajo',
    title: 'De la idea al sistema',
    titleAccent: 'en semanas',
    steps: [
      { n: '01', title: 'Llamada de 30 minutos', text: 'Me cuentas tu negocio y lo que te quita tiempo. Sin tecnicismos.' },
      { n: '02', title: 'Veo cómo trabajas', text: 'Observo el flujo real de tu equipo y te propongo la solución más simple.' },
      { n: '03', title: 'Primera versión en días', text: 'Te muestro algo funcionando pronto y lo ajustamos juntos.' },
      { n: '04', title: 'Lanzamos y medimos', text: 'Lo ponemos en marcha, capacito a tu equipo y sigo a tu lado.' },
    ],
  },
  contact: {
    eyebrow: 'Hablemos',
    title: 'Cuéntame qué',
    titleAccent: 'necesita tu negocio',
    subtitle: 'Te llega un correo de confirmación al instante y te respondo en pocas horas.',
    direct: '¿Prefieres escribirme directo?',
    based: 'Desde Ecuador para toda LatAm y EE.UU.',
  },
  footer: {
    tagline: 'Apps, automatizaciones y webs para dueños de negocio.\nCTO en Bakano · Desde Ecuador para el mundo.',
    links: {
      work: 'Proyectos',
      services: 'Servicios',
      contact: 'Contacto',
      resume: 'Currículum',
    },
    built: 'Construido con Vue 3 · Vite · SCSS',
    copy: 'Todos los derechos reservados.',
  },
}

const en: typeof es = {
  nav: {
    work: 'Projects',
    services: 'Services',
    process: 'How I work',
    contact: 'Contact',
    letsTalk: 'Tell me your idea →',
  },
  hero: {
    available: 'Apps & automations for business owners · Ecuador & LatAm',
    greeting: "Hi, I'm Diego Reyes, aka",
    title: 'Your business, on autopilot.',
    desc: 'I build the software your business needs to <strong>sell more and work less</strong>: internal apps, AI WhatsApp bots, online stores and dashboards. I\'m the CTO at Bakano, where we already help <strong>150+ businesses</strong>.',
    cta: 'Tell me your idea',
    seeWork: 'See projects',
    stats: {
      projects: 'Projects shipped',
      businesses: 'Businesses at Bakano',
      years: 'Years building',
      reply: 'Reply time',
    },
  },
  pains: {
    eyebrow: 'Sound familiar?',
    title: 'If your business looks like this,',
    titleAccent: 'I can help',
    items: [
      { icon: 'fa-solid fa-pen-to-square', color: '#f59e0b', pain: 'Orders arrive on WhatsApp and someone writes them down by hand.', fix: 'A system that receives, sorts and routes them to each team.' },
      { icon: 'fa-solid fa-chart-line', color: '#06d6a0', pain: "You don't know today's sales until someone builds the spreadsheet.", fix: 'A real-time dashboard with your sales and goals.' },
      { icon: 'fa-solid fa-arrows-rotate', color: '#a78bfa', pain: 'Your team repeats the same tasks every single day.', fix: 'Automations that do them on their own, error-free.' },
      { icon: 'fa-solid fa-moon', color: '#60a5fa', pain: 'You lose customers who write after hours.', fix: 'An AI WhatsApp bot that answers and sells 24/7.' },
    ],
  },
  services: {
    eyebrow: 'What I build',
    title: 'Software that',
    titleAccent: 'pays for itself',
    subtitle: "I don't sell hours of code. I sell an operation that runs without you hovering over it.",
    projects: 'projects',
  },
  projects: {
    eyebrow: 'Real portfolio',
    title: 'Businesses already',
    titleAccent: 'working with me',
    subtitle: 'Every one is live, used daily by business owners like you. Filter by what you need.',
  },
  process: {
    eyebrow: 'How I work',
    title: 'From idea to system',
    titleAccent: 'in weeks',
    steps: [
      { n: '01', title: '30-minute call', text: 'You tell me about your business and what eats your time. No jargon.' },
      { n: '02', title: 'I watch how you work', text: "I map your team's real workflow and propose the simplest solution." },
      { n: '03', title: 'First version in days', text: 'You see something working early and we adjust it together.' },
      { n: '04', title: 'Launch and measure', text: 'We go live, I train your team and I stay by your side.' },
    ],
  },
  contact: {
    eyebrow: "Let's talk",
    title: 'Tell me what',
    titleAccent: 'your business needs',
    subtitle: "You'll get a confirmation email right away and I'll reply within hours.",
    direct: 'Prefer to message me directly?',
    based: 'From Ecuador to all of LatAm and the US.',
  },
  footer: {
    tagline: 'Apps, automations and websites for business owners.\nCTO at Bakano · From Ecuador to the world.',
    links: {
      work: 'Projects',
      services: 'Services',
      contact: 'Contact',
      resume: 'Resume',
    },
    built: 'Built with Vue 3 · Vite · SCSS',
    copy: 'All rights reserved.',
  },
}

export { es, en }
