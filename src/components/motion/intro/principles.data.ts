export interface CodeLine {
  prop: string;
  value: string;
}

export interface Principle {
  key: string;
  title: string;
  desc: string;
  code: CodeLine[];
}

export const principles: Principle[] = [
  {
    key: "translation",
    title: "Traslación",
    desc: "Moverse de un punto a otro.",
    code: [{ prop: "transform", value: "translateY(-14px);" }],
  },
  {
    key: "rotation",
    title: "Rotación",
    desc: "Girar sobre un eje.",
    code: [{ prop: "transform", value: "rotate(360deg);" }],
  },
  {
    key: "scaling",
    title: "Escalado",
    desc: "Crecer o achicarse.",
    code: [{ prop: "transform", value: "scale(1.25);" }],
  },
  {
    key: "skew",
    title: "Distorsión",
    desc: "Inclinar la forma.",
    code: [{ prop: "transform", value: "skew(-14deg);" }],
  },
  {
    key: "opacity",
    title: "Opacidad",
    desc: "Aparecer o desvanecerse.",
    code: [{ prop: "opacity", value: "0.4;" }],
  },
  {
    key: "blur",
    title: "Desenfoque",
    desc: "Sumar o quitar foco.",
    code: [{ prop: "filter", value: "blur(3px);" }],
  },
  {
    key: "glow",
    title: "Resplandor",
    desc: "Un toque de luz extra.",
    code: [
      {
        prop: "box-shadow",
        value: "0 0 20px 4px var(--color-primary-soft);",
      },
    ],
  },
  {
    key: "color",
    title: "Color",
    desc: "Transición de color suave.",
    code: [{ prop: "background-color", value: "var(--color-blue);" }],
  },
  {
    key: "clip",
    title: "Recorte",
    desc: "Revelar solo una parte.",
    code: [{ prop: "clip-path", value: "circle(75% at 50% 50%);" }],
  },
  {
    key: "perspective",
    title: "Perspectiva",
    desc: "Profundidad en 2D.",
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

export const labelOf = (k: EffectKey) =>
  principles.find((p) => p.key === k)!.title;

export interface ComboCard {
  title: string;
  keys: string[];
  animation: string;
  code: CodeLine[];
}

export const comboCards: ComboCard[] = [
  {
    title: `${labelOf("translation")} + ${labelOf("rotation")}`,
    keys: ["translation", "rotation"],
    animation: "combo-translate-rotate 2s ease-in-out infinite",
    code: [{ prop: "transform", value: "translateY(-14px) rotate(180deg);" }],
  },
  {
    title: `${labelOf("scaling")} + ${labelOf("opacity")}`,
    keys: ["scaling", "opacity"],
    animation: [effectAnim.scaling, effectAnim.opacity].join(", "),
    code: [
      { prop: "transform", value: "scale(1.25);" },
      { prop: "opacity", value: "0.4;" },
    ],
  },
  {
    title: `${labelOf("skew")} + ${labelOf("color")}`,
    keys: ["skew", "color"],
    animation: [effectAnim.skew, effectAnim.color].join(", "),
    code: [
      { prop: "transform", value: "skew(-14deg);" },
      { prop: "background-color", value: "var(--color-blue);" },
    ],
  },
  {
    title: `${labelOf("blur")} + ${labelOf("opacity")}`,
    keys: ["blur", "opacity"],
    animation: [effectAnim.blur, effectAnim.opacity].join(", "),
    code: [
      { prop: "filter", value: "blur(3px);" },
      { prop: "opacity", value: "0.4;" },
    ],
  },
  {
    title: `${labelOf("clip")} + ${labelOf("perspective")}`,
    keys: ["clip", "perspective"],
    animation: [effectAnim.clip, effectAnim.perspective].join(", "),
    code: [
      { prop: "clip-path", value: "circle(75% at 50% 50%);" },
      { prop: "transform", value: "rotateX(20deg) translateZ(-50px);" },
    ],
  },
  {
    title: `${labelOf("rotation")} + ${labelOf("color")}`,
    keys: ["rotation", "color"],
    animation: [effectAnim.rotation, effectAnim.color].join(", "),
    code: [
      { prop: "transform", value: "rotate(360deg);" },
      { prop: "background-color", value: "var(--color-blue);" },
    ],
  },
  {
    title: `${labelOf("blur")} + ${labelOf("opacity")} + ${labelOf("perspective")}`,
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
