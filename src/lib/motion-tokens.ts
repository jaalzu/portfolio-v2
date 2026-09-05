import { animate as motionAnimate } from "motion";

// ---- SPRINGS: la física de cada tipo de movimiento, definida UNA vez ----
export const springs = {
	// "A sale, B entra" — labels que cambian, íconos que se turnan
	swap: { type: "spring", stiffness: 600, damping: 30, mass: 0.35 } as const,

	// feedback táctil al presionar un botón
	press: { type: "spring", stiffness: 500, damping: 22, mass: 0.5 } as const,
	release: { type: "spring", stiffness: 300, damping: 18, mass: 0.6 } as const,

	// reveals más grandes (cards, acordeones) — no usado todavía, queda listo
	reveal: { type: "spring", stiffness: 220, damping: 24, mass: 0.9 } as const,
};

// el delay estándar entre "sale" y "entra" en cualquier swap
export const swapDelay = 0.05;

// ---- PRESS FEEDBACK: los 3 ingredientes que hacen que un :active se sienta bien ----
// Referencia: por qué esto funciona, no solo qué valores usar.
//
// 1. Scale-down sutil (0.97, no menos) — simula que el botón "se hunde" al tacto,
//    dando feedback físico a algo que no tiene textura real.
// 2. Blur breve en los bordes durante la transición (NUNCA en el contenido/ícono) —
//    mezcla visualmente los dos estados en vez de cortar limpio entre ellos, evitando
//    que el ojo perciba el cambio como "picado". Se aplica vía pseudo-elemento
//    (::before con background: currentColor + filter: blur), nunca en el elemento
//    que contiene texto o íconos, porque eso los desenfocaría a ellos también.
// 3. Duración corta + ease-out (nunca ease-in) — ease-out responde inmediato al
//    input y desacelera solo al llegar a destino, por eso se siente "snappier".
//    ease-in arranca lento, entonces la respuesta se percibe con delay.
export const pressFeedback = {
	scale: 0.97,
	duration: "0.15s",
	easing: "ease-out",
	blurAmount: "2px",
	// opacidad recomendada para el halo de blur en :active (no 1 — eso sería un flash sólido)
	haloOpacity: 0.12,
} as const;

// Snippet de referencia para copiar/pegar en CSS de botones nuevos.
// No se ejecuta — es documentación viva junto al resto de los tokens.
export const pressFeedbackCssReference = `
  .btn {
    position: relative;
    overflow: visible; /* el halo con blur necesita poder salir del borde */
    transition: transform ${pressFeedback.duration} ${pressFeedback.easing};
  }
  .btn::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    filter: blur(${pressFeedback.blurAmount});
    transition: opacity ${pressFeedback.duration} ${pressFeedback.easing};
    pointer-events: none;
    z-index: -1;
  }
  .btn:active {
    transform: scale(${pressFeedback.scale});
  }
  .btn:active::before {
    opacity: ${pressFeedback.haloOpacity};
  }
`;

// ---- respeta prefers-reduced-motion para TODO lo que pase por Motion ----
function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// usá esta función en vez de animate() directo, en todos lados
export function safeAnimate(
	el: Element,
	keyframes: Record<string, any>,
	options: Record<string, any>,
) {
	if (prefersReducedMotion()) {
		return motionAnimate(el, keyframes, { duration: 0 });
	}
	return motionAnimate(el, keyframes as any, options as any);
}