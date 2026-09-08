// // DesignTokensDemo.client.ts
// // Lógica del demo: anotaciones, carrusel, pickers, sliders continuos y tooltip compartido.

// const LINE_SHORTEN = 14;
// const KICK_THRESHOLD_MS = 60;

// type Range = { min: number; max: number };
// const lerp = (r: Range, t: number) => r.min + (r.max - r.min) * (t / 2);

// const RADIUS_RANGE: Range = { min: 0, max: 32 };
// const FONT_RANGE: Range = { min: 0.95, max: 1.4 };

// export function initTokensDemo(demo: HTMLElement) {
//   if (demo.dataset.bound === "1") return;
//   demo.dataset.bound = "1";

//   const card = demo.querySelector<HTMLElement>("#tk-card");
//   const stage = demo.querySelector<HTMLElement>("#tk-stage");
//   const infoBtn = demo.querySelector<HTMLButtonElement>("#tk-info-btn");
//   const layer = demo.querySelector<HTMLElement>("#tk-annot-layer");
//   const toolbar = demo.querySelector<HTMLElement>("#tk-toolbar");
//   const tooltipEl = demo.querySelector<HTMLElement>("#tk-tooltip");
//   if (!card || !stage || !infoBtn || !layer || !toolbar || !tooltipEl) return;

//   // ---------------------------------------------------------------------
//   // Anotaciones de tokens
//   // ---------------------------------------------------------------------
//   const labels = Array.from(layer.querySelectorAll<HTMLElement>(".tk-annot-label"));
//   const lines = new Map<string, SVGLineElement>();
//   layer.querySelectorAll<SVGLineElement>(".tk-annot-line").forEach((l) => lines.set(l.dataset.for!, l));

//   let annotationsActive = false;

//   function positionAnnotations() {
//     if (stage!.getBoundingClientRect().width < 640) return;
//     const stageRect = stage!.getBoundingClientRect();
//     const edgeMargin = 16;

//     labels.forEach((label) => {
//       const anchor = label.dataset.anchor!;
//       const side = label.dataset.side as "left" | "right";
//       const target = card!.querySelector<HTMLElement>(`[data-token="${anchor}"]`);
//       const line = lines.get(anchor);
//       if (!target || !line) return;

//       const t = target.getBoundingClientRect();
//       const targetX = t.left + t.width / 2 - stageRect.left;
//       const targetY = t.top + t.height / 2 - stageRect.top;

//       const l = label.getBoundingClientRect();
//       const labelX = side === "left" ? edgeMargin : stageRect.width - l.width - edgeMargin;
//       const labelY = Math.max(0, Math.min(stageRect.height - l.height, targetY - l.height / 2));
//       label.style.left = `${labelX}px`;
//       label.style.top = `${labelY}px`;

//       const startX = side === "left" ? labelX + l.width : labelX;
//       const startY = labelY + l.height / 2;
//       const dx = targetX - startX;
//       const dy = targetY - startY;
//       const dist = Math.hypot(dx, dy) || 1;
//       const ratio = Math.max(0, (dist - LINE_SHORTEN) / dist);

//       line.setAttribute("x1", String(startX));
//       line.setAttribute("y1", String(startY));
//       line.setAttribute("x2", String(startX + dx * ratio));
//       line.setAttribute("y2", String(startY + dy * ratio));
//     });
//   }

//   infoBtn.addEventListener("click", () => {
//     annotationsActive = !annotationsActive;
//     infoBtn.setAttribute("aria-pressed", String(annotationsActive));
//     stage!.classList.toggle("is-annotating", annotationsActive);
//     if (annotationsActive) positionAnnotations();
//   });
//   window.addEventListener("resize", () => annotationsActive && positionAnnotations());

//   // ---------------------------------------------------------------------
//   // Carrusel
//   // ---------------------------------------------------------------------
//   const track = demo.querySelector<HTMLElement>("#tk-track");
//   const dots = Array.from(demo.querySelectorAll<HTMLElement>(".tk-card__dot"));
//   let slideIndex = 0;

//   function goToSlide(i: number) {
//     slideIndex = (i + dots.length) % dots.length;
//     if (track) track.style.transform = `translateX(-${slideIndex * (100 / dots.length)}%)`;
//     dots.forEach((d, idx) => d.classList.toggle("is-active", idx === slideIndex));
//   }

//   demo.querySelector("#tk-prev")?.addEventListener("click", () => goToSlide(slideIndex - 1));
//   demo.querySelector("#tk-next")?.addEventListener("click", () => goToSlide(slideIndex + 1));
//   dots.forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));

//   // ---------------------------------------------------------------------
//   // Tooltip compartido — micro-interacción "kick + settle" reutilizable
//   // ---------------------------------------------------------------------
//   let tooltipHasAppeared = false;
//   const lastKick = { t: 0 };

//   function positionTooltip(target: HTMLElement) {
//     const tb = toolbar!.getBoundingClientRect();
//     const r = target.getBoundingClientRect();
//     tooltipEl!.style.left = `${r.left + r.width / 2 - tb.left}px`;
//     tooltipEl!.style.top = `${r.top - tb.top}px`;
//   }

//   // Salto instantáneo con blur (sin transición) + vuelta animada (.tk-settle en CSS).
//   // El "void el.offsetWidth" es la parte crítica: fuerza al navegador a pintar
//   // el estado "kicked" antes de programar el cambio a "settle" en el próximo frame.
//   // Sin ese reflow, ambas mutaciones de clase se funden en una sola y no se ve nada.
//   // Sirve para cualquier valor numérico que cambie rápido, no solo el tooltip.
//   function kickOrSettle(el: HTMLElement) {
//     const now = performance.now();
//     const isFast = now - lastKick.t < KICK_THRESHOLD_MS;
//     lastKick.t = now;
//     if (!isFast) return;

//     el.classList.remove("tk-settle");
//     el.classList.add("tk-kicked");
//     void el.offsetWidth; // reflow forzado — no borrar
//     requestAnimationFrame(() => {
//       el.classList.remove("tk-kicked");
//       el.classList.add("tk-settle");
//     });
//   }

//   function showTooltip(target: HTMLElement, text: string) {
//     const match = text.match(/^(.*?)([\d.]+.*)$/);
//     const prefix = match ? match[1] : "";
//     const value = match ? match[2] : text;

//     let valueEl = tooltipEl!.querySelector<HTMLElement>(".tk-tooltip__value");
//     if (!valueEl) {
//       tooltipEl!.innerHTML = `${prefix}<span class="tk-tooltip__value tk-settle">${value}</span>`;
//     } else {
//       const prefixNode = tooltipEl!.firstChild;
//       if (prefixNode?.nodeType === Node.TEXT_NODE) prefixNode.textContent = prefix;
//       else tooltipEl!.insertBefore(document.createTextNode(prefix), tooltipEl!.firstChild);

//       valueEl.textContent = value;
//       kickOrSettle(valueEl);
//     }

//     positionTooltip(target);

//     tooltipEl!.style.transition = tooltipHasAppeared ? "none" : "opacity 0.15s ease";
//     tooltipEl!.style.opacity = tooltipHasAppeared ? "1" : "0.96";
//     tooltipEl!.classList.add("is-visible");
//     if (!tooltipHasAppeared) {
//       requestAnimationFrame(() => (tooltipEl!.style.opacity = "1"));
//       tooltipHasAppeared = true;
//     }
//   }

//   function hideTooltip() {
//     tooltipEl!.classList.remove("is-visible");
//   }

//   // ---------------------------------------------------------------------
//   // Pickers de color — un solo binding para los tres
//   // ---------------------------------------------------------------------
//   const PICKER_VARS: Record<string, string> = { bg: "--tk-bg", primary: "--tk-primary", text: "--tk-text" };

//   demo.querySelectorAll<HTMLLabelElement>(".tk-picker").forEach((picker) => {
//     const input = picker.querySelector<HTMLInputElement>(".tk-picker__input")!;
//     const swatch = picker.querySelector<HTMLElement>(".tk-picker__swatch")!;
//     const tooltipText = picker.dataset.tooltip ?? "";
//     const cssVar = PICKER_VARS[input.dataset.token ?? ""];

//     swatch.style.background = input.value;

//     input.addEventListener("input", () => {
//       swatch.style.background = input.value;
//       if (cssVar) card!.style.setProperty(cssVar, input.value);
//       if (annotationsActive) positionAnnotations();
//       showTooltip(picker, tooltipText);
//     });

//     picker.addEventListener("pointerenter", () => showTooltip(picker, tooltipText));
//     picker.addEventListener("focusin", () => showTooltip(picker, tooltipText));
//     picker.addEventListener("pointerleave", hideTooltip);
//     picker.addEventListener("focusout", hideTooltip);
//   });

//   // ---------------------------------------------------------------------
//   // Sliders continuos — un binder genérico reemplaza el código duplicado
//   // que antes tenía radius y font por separado
//   // ---------------------------------------------------------------------
//   function bindSlider(id: string, range: Range, cssVar: string, format: (v: number) => string) {
//     const slider = demo.querySelector<HTMLInputElement>(`#${id}`);
//     if (!slider) return;

//     const currentValue = () => lerp(range, Number(slider.value));
//     const tooltipText = () => `${slider.dataset.tooltipPrefix ?? ""}: ${format(currentValue())}`;

//     function apply() {
//       card!.style.setProperty(cssVar, format(currentValue()));
//       if (annotationsActive) positionAnnotations();
//     }

//     apply(); // valor inicial

//     slider.addEventListener("input", () => {
//       apply();
//       showTooltip(slider, tooltipText());
//     });
//     slider.addEventListener("pointerenter", () => showTooltip(slider, tooltipText()));
//     slider.addEventListener("focusin", () => showTooltip(slider, tooltipText()));
//     slider.addEventListener("pointerleave", hideTooltip);
//     slider.addEventListener("focusout", hideTooltip);
//   }

//   bindSlider("tk-radius-slider", RADIUS_RANGE, "--tk-radius", (v) => `${v.toFixed(0)}px`);
//   bindSlider("tk-fontsize-slider", FONT_RANGE, "--tk-title-size", (v) => `${v.toFixed(2)}rem`);
// }