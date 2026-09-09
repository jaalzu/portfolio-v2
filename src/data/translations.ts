export const translations = {
	es: {
		sections: {
			projects: "Proyectos",
			techStack: "Skills",
			aboutMe: "Mas sobre mi",
		},
	bio1: '<span class="about__design">Creando interfaces web</span> en la intersección entre diseño y código, donde la belleza se define por lo bien que funcionan.<br><br>Construyo aplicaciones web usando React, Next.js, TypeScript y CSS, desde flujos de datos y decisiones de arquitectura hasta sistemas de UI y componentes reutilizables y pulidos, cuidando cada mínimo detalle que hace cada experiencia <span class="about__unique">única.</span>',
	
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
// es
about: [
  "Soy de ",
  "Tengo 25 años y 4 años de experiencia como desarrollador web. La mayor parte del tiempo estoy escuchando música o aprendiendo cosas que probablemente jamás use.",
  "",
  "",
],
// es
province: {
  name: "Chaco, Argentina",
  alt: "Foto de Chaco",
},
	
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
   designTokens: {
    title: "Fundamentos de Tokens — Consistencia Real",
    description:
      "Un diseño no es consistente porque se vea bien una vez, sino porque todo viene de la misma fuente. Tocá un token y mirá cómo cambian varios componentes a la vez.",
  },
		},
	},
	en: {
		sections: {
			projects: "Projects",
			techStack: "Skills",
			aboutMe: "About Me",
		},
	bio1: '<span class="about__design">Crafting web interfaces</span> at the intersection of design and code where beauty is defined by how well they work.<br><br>I build web applications using React, Next.js, TypeScript, and CSS, from data flows and architectural decisions to UI systems and polished, reusable components, caring about every small detail that makes an experience feel <span class="about__unique">unique</span>.',
	
	
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
// en
about: [
  "I'm from ",
  "I'm 25 years old with 4 years of experience as a web developer. Most of the time, you'll find me listening to music or learning things I'll probably never use.",
  "",
  "",
],
// en
province: {
  name: "Chaco, Argentina",
  alt: "Chaco photo",
},
		
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
  en: {
  designTokens: {
    title: "Design Tokens Foundation — Real Consistency",
    description:
      "A design isn't consistent because it looks good once — it's consistent because everything comes from the same source. Change one token and watch several components update at once.",
  },
},
},
		},
	},
} as const;

export type Lang = keyof typeof translations;