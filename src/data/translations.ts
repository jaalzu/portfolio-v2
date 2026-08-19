export const translations = {
  es: {
    sections: {
      projects: "Proyectos",
      techStack: "Skills",
      journey: "Trayectoria",
    },
    bio1: "Soy <strong>Frontend Developer</strong>, especializado en construir aplicaciones web, landing pages e interfaces de usuario. Transformo desafíos complejos en código funcional y productos fáciles de usar, combinando sólidos principios de software, buenas herramientas y un fuerte sentido del <strong>diseño</strong>.",
    bio2Before:
      "La mayor parte de mi camino la construí de forma independiente y ahora busco sumar esa experiencia a un equipo, colaborar con grandes profesionales y construir productos increíbles.",
    emailIntro: "Podés escribirme a mi",
    emailWord: "correo",
    aria: {
      cv: "Descargar CV",
    },
    cvHref: "/CV-ESP.pdf",
    projects: [
      "Marketplace para comprar y vender artículos nuevos y usados.",
      "Una forma interactiva de elegir tus colores y fuentes en tiempo real.",
      "Plataforma educativa privada para gestionar cursos, alumnos y contenido.",
    ],
    journey: [
      "Comencé con los fundamentos de programación usando PSeInt, Python y SQL.",
      "Pasé al desarrollo web con HTML, CSS y JavaScript, mientras aprendia sobre diseño UI/UX",
      "Empecé a trabajar con React y Next.js, construyendo aplicaciones más grandes y complejas.",
      "Evolucioné mi enfoque hacia el desarrollo, aprendiendo continuamente y perfeccionando mi forma de trabajar, mientras transformo ideas y desafíos en experiencias de alta calidad con las que las personas puedan conectar.",
    ],
  },
  en: {
    sections: {
      projects: "Projects",
      techStack: "Skills",
      journey: "Journey",
    },
    bio1: "I am a <strong>Frontend Developer</strong> with expertise in building web applications, landing pages, and user interfaces. I turn complex challenges into functional code and user-friendly products, crafting them with solid software principles, excellent tools, and a strong sense of <strong>design</strong>.",
    bio2Before:
      "Most of my journey has been built independently, and now I'm looking to bring that experience to a team, collaborate with great professionals, and build amazing products.",
    emailIntro: "You can reach me via",
    emailWord: "email",
    aria: {
      cv: "Download CV",
    },
    cvHref: "/CV-ENG.pdf",
    projects: [
      "Modern marketplace for buying and selling new and second-hand items.",
      "An interactive way to pick your colors and fonts in real time.",
      "Private learning platform for managing courses, students, and content.",
    ],
    journey: [
      "Started with programming fundamentals using PSeInt, Python, and SQL.",
      "Moved into web development with HTML, CSS, and JavaScript while exploring UI/UX principles.",
      "Started working with React and Next.js, building larger and more complex applications.",
      "Evolved my approach to development, continuously learning and refining my craft while turning ideas and challenges into high-quality experiences that people can connect with.",
    ],
  },
} as const;

export type Lang = keyof typeof translations;
