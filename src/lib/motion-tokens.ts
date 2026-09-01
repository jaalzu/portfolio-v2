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
