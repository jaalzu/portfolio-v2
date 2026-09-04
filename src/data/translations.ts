export const translations = {
	es: {
		sections: {
			projects: "Proyectos",
			techStack: "Skills",
			journey: "Trayectoria",
		},
	bio1: 'Conecto <span class="about__design">diseño</span> con <span class="about__code">código</span> para crear productos digitales que se sienten tan bien como funcionan.<br><br>Construyo aplicaciones web con React, TypeScript, Next.js y CSS, desde flujos de datos y decisiones de arquitectura hasta sistemas de UI y componentes reutilizables y pulidos, cuidando cada mínimo detalle que hace que una experiencia se sienta  <span class="about__unique">única</span>.',
	
		emailWord: "Email",
		// emailAfter: "gratis!",
		githubIntro: "Podés ver mi código en",
		githubWord: "GitHub",
		talkIntro: "contactarme por",
		linkedinWord: "LinkedIn",
		orWord: "o",
		cvIntro: "y consultar mi ",
		cvWord: "CV",
		aria: {
			cv: "Descargar CV",
		},
		cvHref: "/CV-ESP.pdf",
		projects: [
			"Marketplace para comprar y vender artículos nuevos y usados.",
			"Una forma interactiva de elegir tus colores y fuentes en tiempo real.",
			"Plataforma privada para la gestión de cursos, alumnos y contenidos.",
		],
		journey: [
			"Comencé con los fundamentos de programación usando PSeInt, Python y SQL.",
			"Pasé al desarrollo web con HTML, CSS y JavaScript, mientras aprendia sobre diseño UI/UX",
			"Empecé a trabajar con React y Next.js, construyendo aplicaciones más grandes y complejas.",
			"Descubrí una forma de convertir mi pasión en mejores sistemas de diseño y experiencias web.",
		],
	
		skillsPromo: {
			title: "Mejora tus interfaces con agentes especializados",
			subtitle: "Skills y agentes para mejorar tus interfaces.",
		},
		skills: {
			back: "Inicio",
		},
		skillsPage: {
			subtitle: "Una colección de skills para mejorar tus interfaces.",
			installTitle: "Instalación",
			installHint: "Copia el comando e instala la skill que necesites.",
			github: "GitHub",
			viewLive: "Ver en vivo",
		typography: {
    title: "Fundamentos de Tipografía — UI y Calidad",
    description:
        "El texto es el corazón de cada interfaz. Construye o audita tu tipografía para fortalecer la legibilidad, la jerarquía, la accesibilidad y la consistencia visual, ofreciendo así mejores experiencias de usuario.",
},
  accessibility: {
    title: "Accesibilidad — Foco y Feedback",
    description:
      "Tu web tiene que ser accesible para todos, sin excepciones. Construí o auditá el foco visible, los errores anunciados a tiempo y el feedback en vivo de tu interfaz.",
  },
		},
	},
	en: {
		sections: {
			projects: "Projects",
			techStack: "Skills",
			journey: "Journey",
		},
	bio1: 'I bridge <span class="about__design">design</span> and <span class="about__code">code</span> to build products that feel as good as they work.<br><br>I build web applications with React, TypeScript, Next.js, and CSS, from data flows and architectural decisions to UI systems and polished, reusable components, caring about every small detail that makes an experience feel <span class="about__unique">unique</span>.',
	
	
		emailWord: "Email",
		githubWord: "GitHub",
		linkedinWord: "LinkedIn",
		cvWord: "CV",
		aria: {
			cv: "Download CV",
		},
		cvHref: "/CV-ENG.pdf",
		projects: [
			"Modern marketplace for buying and selling new and second-hand items.",
			"An interactive way to pick your colors and fonts in real time.",
			"Private platform to manage courses, students, and content.",
		],
		journey: [
			"Started with programming fundamentals using PSeInt, Python, and SQL.",
			"Moved into web development with HTML, CSS and JavaScript while exploring UI/UX principles.",
			"Started working with React and Next.js, building larger and more complex applications.",
			"Found a meaningful way to channel my passion through design systems and better web UX",
		],
		
		skillsPromo: {
			title: "Improve your interfaces with specialized agents",
			subtitle: "Skills and agents to improve your interfaces.",
		},
		skills: {
			back: "Home",
		},
		skillsPage: {
			subtitle:
				"Two practical agent skills for making interfaces easier to use and read.",
			installTitle: "Installation",
			installHint: "Copy the command and install the skill you need.",
			github: "GitHub",
			viewLive: "View live",
			typography: {
				title: "Typography Foundation — UI & Quality",
				description:
					"Text is at the heart of every interface. Build or audit your typography to strengthen legibility, hierarchy, accessibility and visual consistency for better user experiences.",
			},
			en: {
 accessibility: {
    title: "Accessibility — Focus & Feedback",
    description:
      "Your site needs to be accessible to everyone, no exceptions. Build or audit visible focus states, timely error announcements, and live feedback across your interface.",
  },
},
		},
	},
} as const;

export type Lang = keyof typeof translations;