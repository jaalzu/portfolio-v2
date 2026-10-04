export interface CodeLine {
  prop: string;
  value: string;
}

export interface Principle {
  key: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  code: CodeLine[];
}

export const principles: Principle[] = [
  {
    key: "translation",
    titleEs: "Traslación",
    titleEn: "Translation",
    descEs: "Moverse de un punto a otro.",
    descEn: "Move from one point to another.",
    code: [{ prop: "transform", value: "translateY(-14px);" }],
  },
  {
    key: "rotation",
    titleEs: "Rotación",
    titleEn: "Rotation",
    descEs: "Girar sobre un eje.",
    descEn: "Rotate around an axis.",
    code: [{ prop: "transform", value: "rotate(360deg);" }],
  },
  {
    key: "scaling",
    titleEs: "Escalado",
    titleEn: "Scaling",
    descEs: "Crecer o achicarse.",
    descEn: "Grow or shrink.",
    code: [{ prop: "transform", value: "scale(1.25);" }],
  },
  {
    key: "skew",
    titleEs: "Distorsión",
    titleEn: "Skew",
    descEs: "Inclinar la forma.",
    descEn: "Tilt the shape.",
    code: [{ prop: "transform", value: "skew(-14deg);" }],
  },
  {
    key: "opacity",
    titleEs: "Opacidad",
    titleEn: "Opacity",
    descEs: "Aparecer o desvanecerse.",
    descEn: "Appear or fade away.",
    code: [{ prop: "opacity", value: "0.4;" }],
  },
  {
    key: "blur",
    titleEs: "Desenfoque",
    titleEn: "Blur",
    descEs: "Sumar o quitar foco.",
    descEn: "Add or remove focus.",
    code: [{ prop: "filter", value: "blur(3px);" }],
  },
  {
    key: "glow",
    titleEs: "Resplandor",
    titleEn: "Glow",
    descEs: "Un toque de luz extra.",
    descEn: "An extra touch of light.",
    code: [
      {
        prop: "box-shadow",
        value: "0 0 20px 4px var(--color-primary-soft);",
      },
    ],
  },
  {
    key: "color",
    titleEs: "Color",
    titleEn: "Color",
    descEs: "Transición de color suave.",
    descEn: "Smooth color transition.",
    code: [{ prop: "background-color", value: "var(--color-blue);" }],
  },
  {
    key: "clip",
    titleEs: "Recorte",
    titleEn: "Clipping",
    descEs: "Revelar solo una parte.",
    descEn: "Reveal only a part.",
    code: [{ prop: "clip-path", value: "circle(75% at 50% 50%);" }],
  },
  {
    key: "perspective",
    titleEs: "Perspectiva",
    titleEn: "Perspective",
    descEs: "Profundidad en 2D.",
    descEn: "Depth in 2D.",
    code: [{ prop: "transform", value: "rotateX(20deg) translateZ(-50px);" }],
  },
];

// Todas a 2s. Solo cambia el timing-function (rotation es linear porque es un
// giro completo, no un bounce).
export const effectAnim = {
  translation: "principle-translate 2s ease-in-out infinite",
  rotation: "principle-rotate 2s linear infinite",
  scaling: "principle-scale 2s ease-in-out infinite",
  skew: "principle-skew 2s ease-in-out infinite",
  opacity: "principle-opacity 2s ease-in-out infinite",
  blur: "principle-blur 2s ease-in-out infinite",
  glow: "principle-glow 2s ease-in-out infinite",
  color: "principle-color 2s ease-in-out infinite",
  clip: "principle-clip 2s ease-in-out infinite",
  perspective: "principle-perspective 2s ease-in-out infinite",
} as const;

export type EffectKey = keyof typeof effectAnim;

export function titleOf(k: string, lang: "es" | "en"): string {
  const p = principles.find((p) => p.key === k);
  if (!p) return k;
  return lang === "en" ? p.titleEn : p.titleEs;
}

/** @deprecated Usa titleOf(key, lang) con dual DOM. */
export const labelOf = (k: EffectKey) => titleOf(k, "es");

export interface ComboCard {
  keys: string[];
  animation: string;
  code: CodeLine[];
}

export const comboCards: ComboCard[] = [
  {
    keys: ["translation", "glow"],
    animation: "combo-translate-glow 2s ease-in-out infinite",
    code: [
      { prop: "transform", value: "translateX(14px);" },
      { prop: "box-shadow", value: "0 0 20px 4px var(--color-primary-soft);" },
    ],
  },
  {
    keys: ["scaling", "opacity"],
    animation: [effectAnim.scaling, effectAnim.opacity].join(", "),
    code: [
      { prop: "transform", value: "scale(1.25);" },
      { prop: "opacity", value: "0.4;" },
    ],
  },
  {
    keys: ["skew", "color"],
    animation: [effectAnim.skew, effectAnim.color].join(", "),
    code: [
      { prop: "transform", value: "skew(-14deg);" },
      { prop: "background-color", value: "var(--color-blue);" },
    ],
  },
  {
    keys: ["blur", "opacity"],
    animation: [effectAnim.blur, effectAnim.opacity].join(", "),
    code: [
      { prop: "filter", value: "blur(3px);" },
      { prop: "opacity", value: "0.4;" },
    ],
  },
  {
    keys: ["clip", "translation"],
    animation: [effectAnim.clip, effectAnim.translation].join(", "),
    code: [
      { prop: "clip-path", value: "circle(75% at 50% 50%);" },
      { prop: "transform", value: "translateY(-14px);" },
    ],
  },
  {
    keys: ["rotation", "color"],
    animation: [effectAnim.rotation, effectAnim.color].join(", "),
    code: [
      { prop: "transform", value: "rotate(360deg);" },
      { prop: "background-color", value: "var(--color-blue);" },
    ],
  },
  {
    keys: ["blur", "opacity", "perspective"],
    animation: [
      effectAnim.blur,
      effectAnim.opacity,
      effectAnim.perspective,
    ].join(", "),
    code: [
      { prop: "filter", value: "blur(3px);" },
      { prop: "opacity", value: "0.4;" },
      { prop: "transform", value: "rotateX(20deg) translateZ(-50px);" },
    ],
  },
];
