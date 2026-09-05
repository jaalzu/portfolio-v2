// DesignTokensDemo.client.ts
// Lógica del demo: anotaciones de tokens, pickers de color, sliders y tooltip compartido.

type RadiusStep = { label: string; value: string };
type FontStep = { label: string; value: string };

const RADIUS_STEPS: RadiusStep[] = [
  { label: "sm", value: "8px" },
  { label: "md", value: "12px" },
  { label: "full", value: "999px" },
];

const FONT_STEPS: FontStep[] = [
  { label: "sm", value: "0.95rem" },
  { label: "md", value: "1.125rem" },
  { label: "lg", value: "1.375rem" },
];

// cuánto se acorta cada línea del lado de la card, en px
const LINE_SHORTEN = 14;

export function initTokensDemo(demo: HTMLElement) {
  if (demo.dataset.bound === "1") return;
  demo.dataset.bound = "1";

  const card = demo.querySelector<HTMLElement>("#tk-card");
  const stage = demo.querySelector<HTMLElement>("#tk-stage");
  const infoBtn = demo.querySelector<HTMLButtonElement>("#tk-info-btn");
  const layer = demo.querySelector<HTMLElement>("#tk-annot-layer");
  const toolbar = demo.querySelector<HTMLElement>("#tk-toolbar");
  const tooltip = demo.querySelector<HTMLElement>("#tk-tooltip");
  if (!card || !stage || !infoBtn || !layer || !toolbar || !tooltip) return;

  const labels = Array.from(layer.querySelectorAll<HTMLElement>(".tk-annot-label"));
  const lines = new Map<string, SVGLineElement>();
  layer.querySelectorAll<SVGLineElement>(".tk-annot-line").forEach((line) => {
    lines.set(line.dataset.for!, line);
  });

  let annotationsActive = false;

  // ---- anotaciones: medir contra el layout real de la card ----
  function positionAnnotations() {
    if (stage!.getBoundingClientRect().width < 640) return;

    const stageRect = stage!.getBoundingClientRect();
    const edgeMargin = 16;

    labels.forEach((label) => {
      const anchorKey = label.dataset.anchor!;
      const target = card!.querySelector<HTMLElement>(`[data-token="${anchorKey}"]`);
      const line = lines.get(anchorKey);
      if (!target || !line) return;

      const tRect = target.getBoundingClientRect();
      const targetX = tRect.left + tRect.width / 2 - stageRect.left;
      const targetY = tRect.top + tRect.height / 2 - stageRect.top;

      const labelRect = label.getBoundingClientRect();
      const side = label.dataset.side;
      const labelX = side === "left" ? edgeMargin : stageRect.width - labelRect.width - edgeMargin;
      const labelY = Math.max(0, Math.min(stageRect.height - labelRect.height, targetY - labelRect.height / 2));

      label.style.left = `${labelX}px`;
      label.style.top = `${labelY}px`;

      const lineStartX = side === "left" ? labelX + labelRect.width : labelX;
      const lineStartY = labelY + labelRect.height / 2;

      // acorta la línea del lado de la card (no llega hasta el centro exacto)
      const dx = targetX - lineStartX;
      const dy = targetY - lineStartY;
      const dist = Math.hypot(dx, dy) || 1;
      const ratio = Math.max(0, (dist - LINE_SHORTEN) / dist);
      const endX = lineStartX + dx * ratio;
      const endY = lineStartY + dy * ratio;

      line.setAttribute("x1", String(lineStartX));
      line.setAttribute("y1", String(lineStartY));
      line.setAttribute("x2", String(endX));
      line.setAttribute("y2", String(endY));
    });
  }

  infoBtn.addEventListener("click", () => {
    annotationsActive = !annotationsActive;
    infoBtn.setAttribute("aria-pressed", String(annotationsActive));
    stage!.classList.toggle("is-annotating", annotationsActive);
    if (annotationsActive) positionAnnotations();
  });

  window.addEventListener("resize", () => {
    if (annotationsActive) positionAnnotations();
  });

  // ---- tooltip compartido: primera aparición con fade corto desde 0.96,
  // las siguientes (mientras el flag esté activo) aparecen sin animación ----
  let tooltipHasAppeared = false;

  function positionTooltip(target: HTMLElement) {
    const toolbarRect = toolbar!.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const x = targetRect.left + targetRect.width / 2 - toolbarRect.left;
    const y = targetRect.top - toolbarRect.top;
    tooltip!.style.left = `${x}px`;
    tooltip!.style.top = `${y}px`;
  }

  function showTooltip(target: HTMLElement, text: string) {
    tooltip!.textContent = text;
    positionTooltip(target);

    if (!tooltipHasAppeared) {
      tooltip!.style.transition = "opacity 0.15s ease";
      tooltip!.style.opacity = "0.96";
      tooltip!.classList.add("is-visible");
      requestAnimationFrame(() => {
        tooltip!.style.opacity = "1";
      });
      tooltipHasAppeared = true;
    } else {
      tooltip!.style.transition = "none";
      tooltip!.style.opacity = "1";
      tooltip!.classList.add("is-visible");
    }
  }

  function hideTooltip() {
    tooltip!.classList.remove("is-visible");
  }

  // ---- color pickers ----
  demo.querySelectorAll<HTMLLabelElement>(".tk-picker").forEach((picker) => {
    const input = picker.querySelector<HTMLInputElement>(".tk-picker__input")!;
    const swatch = picker.querySelector<HTMLElement>(".tk-picker__swatch")!;
    const tooltipText = picker.dataset.tooltip ?? "";

    swatch.style.background = input.value;

    input.addEventListener("input", () => {
      const token = input.dataset.token;
      swatch.style.background = input.value;
      if (token === "bg") card!.style.setProperty("--tk-bg", input.value);
      if (token === "primary") card!.style.setProperty("--tk-primary", input.value);
      if (token === "text") card!.style.setProperty("--tk-text", input.value);
      if (annotationsActive) positionAnnotations();
      showTooltip(picker, tooltipText);
    });

    picker.addEventListener("pointerenter", () => showTooltip(picker, tooltipText));
    picker.addEventListener("focusin", () => showTooltip(picker, tooltipText));
    picker.addEventListener("pointerleave", hideTooltip);
    picker.addEventListener("focusout", hideTooltip);
  });

  // ---- sliders (radius / font) ----
  function wireSlider(sliderId: string, steps: { label: string; value: string }[], cssVar: string) {
    const slider = demo.querySelector<HTMLInputElement>(`#${sliderId}`);
    if (!slider) return;

    const prefix = slider.dataset.tooltipPrefix ?? "";
    const tooltipText = (index: number) => `${prefix}: ${steps[index].label}`;

    function applyStep(index: number) {
      card!.style.setProperty(cssVar, steps[index].value);
      if (annotationsActive) positionAnnotations();
    }

    applyStep(Number(slider.value)); // valor inicial

    slider.addEventListener("input", () => {
      const index = Number(slider.value);
      applyStep(index);
      showTooltip(slider, tooltipText(index));
    });

    slider.addEventListener("pointerenter", () => showTooltip(slider, tooltipText(Number(slider.value))));
    slider.addEventListener("focusin", () => showTooltip(slider, tooltipText(Number(slider.value))));
    slider.addEventListener("pointerleave", hideTooltip);
    slider.addEventListener("focusout", hideTooltip);
  }

  wireSlider("tk-radius-slider", RADIUS_STEPS, "--tk-radius");
  wireSlider("tk-fontsize-slider", FONT_STEPS, "--tk-title-size");
}