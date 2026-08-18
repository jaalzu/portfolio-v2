export const translations = {
  es: {
    sections: {
      projects: "Proyectos",
      techStack: "Skills",
      journey: "Trayectoria",
    },
    bio1: "Soy <strong>Frontend Developer / Design Engineer</strong>, especializado en construir aplicaciones web, landing pages e interfaces de usuario. Transformo desafíos complejos en código funcional y productos fáciles de usar, combinando sólidos principios de software, buenas herramientas y un fuerte sentido del <strong>diseño</strong>.",
    bio2Before:
      "La mayor parte de mi camino la construí de forma independiente y ahora busco sumar esa experiencia a un equipo, colaborar con grandes profesionales y construir productos increíbles.",
    emailIntro: "Podés escribirme por",
    emailWord: "correo",
    aria: {
      cv: "Descargar CV",
    },
    projects: [
      "Una forma interactiva de elegir tus colores y fuentes en tiempo real.",
      "Plataforma educativa privada para gestionar cursos, alumnos y contenido.",
      "Marketplace para comprar y vender artículos nuevos y usados.",
    ],
    journey: [
      "Empecé a aprender lógica de programación con PSeInt, y después pasé a Python y SQL.",
      "Entré al desarrollo web con HTML y CSS.",
      "Aprendí a construir experiencias interactivas con JavaScript, mientras exploraba principios de UI/UX.",
      "Empecé a construir aplicaciones reales con React, explorando nuevas herramientas y prácticas de desarrollo.",
      "Seguí construyendo, rompiendo, arreglando y aprendiendo, empujándome constantemente a ser un mejor desarrollador.",
    ],
  },
  en: {
    sections: {
      projects: "Projects",
      techStack: "Skills",
      journey: "Journey",
    },
    bio1: "I am a <strong>Frontend Developer</strong> with expertise in building web applications, landing pages, and user interfaces. I turn complex <strong>challenges</strong> into <strong>functional</strong> code and user-friendly products, crafting them with solid software principles, excellent tools, and a strong sense of <strong>design</strong>.",
    bio2Before:
      "Most of my journey has been built independently, and now I'm looking to bring that experience to a team, collaborate with great professionals, and build amazing products.",
    emailIntro: "You can reach me via",
    emailWord: "Email",
    aria: {
      cv: "Download CV",
    },
    projects: [
      "An interactive way to pick your colors and fonts in real time.",
      "Private learning platform for managing courses, students, and content.",
      "Modern marketplace for buying and selling new and second-hand items.",
    ],
    journey: [
      "Started learning programming fundamentals with PSeInt, eventually moving into Python and SQL.",
      "I got into web development with HTML and CSS.",
      "Learned to build interactive experiences with JavaScript while exploring UI/UX principles.",
      "Started building real applications with React, exploring new tools and development practices.",
      "I kept building, breaking, fixing, and learning, constantly pushing myself to become a better software developer.",
    ],
  },
} as const;

export type Lang = keyof typeof translations;
