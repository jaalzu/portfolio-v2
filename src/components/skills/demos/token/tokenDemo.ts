type NumRange = { min: number; max: number };

interface AnnotationConfig {
  selector: string;
  side: "left" | "right";
  label: string;
  shorten?: number;
  edgeInset?: number;
  lift?: number;
  liftX?: number;
  labelGap?: number;
  shiftX?: number;
  shiftY?: number;
  dy?: number;
}

interface BuiltAnnotation {
  cfg: AnnotationConfig;
  line: SVGPathElement;
  label: HTMLSpanElement;
}

(function () {
  function initTokensDemo(demo: HTMLElement): void {
    if (demo.dataset.bound === "1") return;
    demo.dataset.bound = "1";

    const LINE_SHORTEN = 30;
    const RADIUS_RANGE: NumRange = { min: 0, max: 32 };
    const FONT_RANGE: NumRange = { min: 0.95, max: 1.4 };

    function lerp(range: NumRange, t: number): number {
      return range.min + (range.max - range.min) * (t / 2);
    }

    // ---------------------------------------------------------------
    // DESKTOP — configuración de cada línea/label.
    // "shorten": sobreescribe LINE_SHORTEN para esta anotación puntual (más corta).
    // "edgeInset": en vez de apuntar al centro del elemento, apunta a X px de su borde.
    // "dy": corre el label hacia abajo (+) o arriba (-) en px, sin mover la línea real.
    // ---------------------------------------------------------------
    const ANNOTATIONS: AnnotationConfig[] = [
      {
        selector: '[data-token="title"]',
        side: "left",
        label: "text-heading",
        shorten: 161,
        lift: 1,
        labelGap: 41,
      },
      {
        selector: '[data-token="text-body"]',
        side: "left",
        label: "text-body",
        shorten: 161,
        lift: 1,
        labelGap: 32,
      },
      {
        selector: '[data-token="content"]',
        side: "right",
        label: "surface-1",
        edgeInset: 35,
        labelGap: 32,
        lift: 0.5,
      },
      {
        selector: '[data-token="button"]',
        side: "right",
        label: "radius-base",
        edgeInset: 28,
        lift: 0,
        labelGap: 38,
      },
      {
        selector: '[data-token="arrow"]',
        side: "right",
        label: "icon-neutral",
        edgeInset: 41,
        lift: 0,
        labelGap: 41,
      },
      {
        selector: '[data-token="avatar"]',
        side: "left",
        label: "primary-color",
        shorten: 8,
        lift: 10,
        labelGap: 45,
        shiftY: -10,
      },
      {
        selector: '[data-token="stars"]',
        side: "left",
        label: "feedback-rating",
        shorten: 31,
        lift: -2,
        labelGap: 51,
        shiftY: 2.5,
      },
    ];

    const cardEl = demo.querySelector<HTMLElement>("#tk-card");
    const stageEl = demo.querySelector<HTMLElement>("#tk-stage");
    const infoBtnEl = demo.querySelector<HTMLButtonElement>("#tk-info-btn");
    const layerEl = demo.querySelector<HTMLElement>("#tk-annot-layer");
    const svgEl = demo.querySelector<SVGSVGElement>("#tk-annot-svg");
    const toolbarEl = demo.querySelector<HTMLElement>("#tk-toolbar");
    const tooltipEl = demo.querySelector<HTMLElement>("#tk-tooltip");
    const tooltipTextEl = demo.querySelector<HTMLElement>("#tk-tooltip-text");
    const tooltipValueEl = demo.querySelector<HTMLElement>("#tk-tooltip-value");

    // ojo: esta guarda se movió ANTES de tocar `svg` (en la versión .js
    // original el insertAdjacentHTML se llamaba antes del chequeo).
    if (
      !cardEl ||
      !stageEl ||
      !infoBtnEl ||
      !layerEl ||
      !svgEl ||
      !toolbarEl ||
      !tooltipEl ||
      !tooltipTextEl ||
      !tooltipValueEl
    )
      return;

    // Re-bindeamos a consts nuevas: a partir de acá el TIPO de cada una
    // ya no incluye `null`, así que los closures de abajo (addEventListener,
    // forEach, positionAnnotations, etc.) no vuelven a pedir chequeo —
    // TS no "recuerda" el narrowing del `if` de arriba dentro de funciones
    // anidadas, pero sí respeta el tipo real de una variable nueva.
    const card = cardEl;
    const stage = stageEl;
    const infoBtn = infoBtnEl;
    const layer = layerEl;
    const svg = svgEl;
    const toolbar = toolbarEl;
    const tooltip = tooltipEl;
    const tooltipText = tooltipTextEl;
    const tooltipValue = tooltipValueEl;

    svg.insertAdjacentHTML(
      "afterbegin",
      '<defs><marker id="tk-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">' +
        '<path d="M3,1.5 L7,5 L3,8.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></marker></defs>',
    );

    const built: BuiltAnnotation[] = ANNOTATIONS.map(function (cfg) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      line.setAttribute("class", "tk-annot-line");
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", "currentColor");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("vector-effect", "non-scaling-stroke");
      line.setAttribute("marker-end", "url(#tk-arrow)");
      line.setAttribute("shape-rendering", "geometricPrecision");
      svg.appendChild(line);

      const label = document.createElement("span");
      label.className = "tk-annot-label";
      label.textContent = cfg.label;
      layer.appendChild(label);

      return { cfg: cfg, line: line, label: label };
    });

    let annotationsActive = false;

    function positionAnnotations(): void {
      const stageRect = stage.getBoundingClientRect();
      const edgeMargin = 16;

      built.forEach(function (item) {
        const cfg = item.cfg;
        const target = card.querySelector(cfg.selector);
        if (!target) return;

        const t = target.getBoundingClientRect();
        let targetX: number;
        if (cfg.edgeInset != null) {
          targetX =
            cfg.side === "right"
              ? t.right - cfg.edgeInset - stageRect.left
              : t.left + cfg.edgeInset - stageRect.left;
        } else {
          targetX = t.left + t.width / 2 - stageRect.left;
        }
        const targetY = t.top + t.height / 2 - stageRect.top;

        const l = item.label.getBoundingClientRect();
        const labelX =
          cfg.side === "left"
            ? edgeMargin
            : stageRect.width - l.width - edgeMargin;
        const dyOffset = cfg.dy || 0;
        const rawY = targetY - l.height / 2 + dyOffset;
        const labelY = Math.max(0, Math.min(stageRect.height - l.height, rawY));

        // ancla real (sin el "lift") — de acá sale la línea, igual que siempre
        const anchorX = labelX + l.width / 2;
        const anchorY = labelY + l.height / 2;

        // el label se dibuja levantado, pero la línea sigue naciendo del ancla real
        const lift = cfg.lift || 0;
        const liftX = cfg.liftX || 0;
        item.label.style.left = labelX + liftX + "px";
        item.label.style.top = labelY - lift + "px";

        const dx = targetX - anchorX;
        const dy = targetY - anchorY;
        const dist = Math.hypot(dx, dy) || 1;

        // recorte del lado de la card (COMO ANTES, sin tocar)
        const shorten = cfg.shorten != null ? cfg.shorten : LINE_SHORTEN;
        const endRatio = Math.max(0, (dist - shorten) / dist);

        // recorte chiquito y nuevo, solo del lado del label
        const labelGap = cfg.labelGap || 0;
        const startRatio = Math.min(endRatio, labelGap / dist);

        const shiftY = cfg.shiftY || 0;
        const shiftX = cfg.shiftX || 0;

        const cardPt = {
          x: anchorX + dx * endRatio + shiftX,
          y: anchorY + dy * endRatio + shiftY,
        };
        const labelPt = {
          x: anchorX + dx * startRatio + shiftX,
          y: anchorY + dy * startRatio + shiftY,
        };

        item.line.setAttribute(
          "d",
          "M" +
            Math.round(cardPt.x) +
            "," +
            Math.round(cardPt.y) +
            " L" +
            Math.round(labelPt.x) +
            "," +
            Math.round(labelPt.y),
        );
      });
    }

    infoBtn.addEventListener("click", function () {
      annotationsActive = !annotationsActive;
      infoBtn.setAttribute("aria-pressed", String(annotationsActive));
      stage.classList.toggle("is-annotating", annotationsActive);
      if (annotationsActive) positionAnnotations();
    });
    window.addEventListener("resize", function () {
      if (annotationsActive) positionAnnotations();
    });

    // ---- carrusel ----
    const track = demo.querySelector<HTMLElement>("#tk-track");
    const slideCount = track ? track.children.length : 1;
    let slideIndex = 0;

    function goToSlide(i: number): void {
      slideIndex = (i + slideCount) % slideCount;
      if (track)
        track.style.transform =
          "translateX(-" + slideIndex * (100 / slideCount) + "%)";
    }

    const prevBtn = demo.querySelector<HTMLButtonElement>("#tk-prev");
    const nextBtn = demo.querySelector<HTMLButtonElement>("#tk-next");
    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        goToSlide(slideIndex - 1);
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        goToSlide(slideIndex + 1);
      });

    // ---- tooltip ----
    let tooltipHasAppeared = false;

    function positionTooltip(target: HTMLElement): void {
      const tb = toolbar.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      tooltip.style.left = r.left + r.width / 2 - tb.left + "px";
      tooltip.style.top = r.top - tb.top + "px";
    }

    function revealTooltip(target: HTMLElement): void {
      positionTooltip(target);
      tooltip.style.transition = tooltipHasAppeared
        ? "none"
        : "opacity 0.15s ease";
      tooltip.style.opacity = tooltipHasAppeared ? "1" : "0.96";
      tooltip.classList.add("is-visible");
      if (!tooltipHasAppeared) {
        requestAnimationFrame(function () {
          tooltip.style.opacity = "1";
        });
        tooltipHasAppeared = true;
      }
    }

    function showStaticTooltip(target: HTMLElement, text: string): void {
      tooltipText.textContent = text;
      tooltipValue.textContent = "";
      revealTooltip(target);
    }

    function showValueTooltip(
      target: HTMLElement,
      prefix: string,
      value: string,
    ): void {
      tooltipText.textContent = prefix;
      tooltipValue.textContent = value;
      tooltipValue.classList.remove("tk-pop");
      void tooltipValue.offsetWidth;
      tooltipValue.classList.add("tk-pop");
      revealTooltip(target);
    }

    function hideTooltip(): void {
      tooltip.classList.remove("is-visible");
    }

    // ---- pickers de color ----
    const PICKER_VARS: Record<string, string> = {
      bg: "--tk-bg",
      primary: "--tk-primary",
      text: "--tk-text",
    };

    demo
      .querySelectorAll<HTMLLabelElement>(".tk-picker")
      .forEach(function (picker) {
        const input =
          picker.querySelector<HTMLInputElement>(".tk-picker__input")!;
        const swatch = picker.querySelector<HTMLElement>(".tk-picker__swatch")!;
        const label = picker.dataset.tooltip || "";
        const tokenKey = input.dataset.token;
        const cssVar = tokenKey ? PICKER_VARS[tokenKey] : undefined;

        swatch.style.background = input.value;

        input.addEventListener("input", function () {
          swatch.style.background = input.value;
          if (cssVar) card.style.setProperty(cssVar, input.value);
          if (annotationsActive) positionAnnotations();
          showStaticTooltip(picker, label);
        });

        picker.addEventListener("pointerenter", function () {
          showStaticTooltip(picker, label);
        });
        picker.addEventListener("focusin", function () {
          showStaticTooltip(picker, label);
        });
        picker.addEventListener("pointerleave", hideTooltip);
        picker.addEventListener("focusout", hideTooltip);
      });

    // ---- sliders ----
    function bindSlider(
      id: string,
      range: NumRange,
      cssVar: string,
      format: (v: number) => string,
    ): void {
      const sliderEl = demo.querySelector<HTMLInputElement>("#" + id);
      if (!sliderEl) return;
      const slider = sliderEl;

      const prefix = (slider.dataset.tooltipPrefix || "") + ": ";

      function currentValue(): number {
        return lerp(range, Number(slider.value));
      }

      function apply(): void {
        card.style.setProperty(cssVar, format(currentValue()));
        if (annotationsActive) positionAnnotations();
      }
      apply();

      slider.addEventListener("input", function () {
        apply();
        showValueTooltip(slider, prefix, format(currentValue()));
      });
      slider.addEventListener("pointerenter", function () {
        showValueTooltip(slider, prefix, format(currentValue()));
      });
      slider.addEventListener("focusin", function () {
        showValueTooltip(slider, prefix, format(currentValue()));
      });
      slider.addEventListener("pointerleave", hideTooltip);
      slider.addEventListener("focusout", hideTooltip);
    }
    requestAnimationFrame(function () {
      positionAnnotations();
    });
    bindSlider("tk-radius-slider", RADIUS_RANGE, "--tk-radius", function (v) {
      return v.toFixed(0) + "px";
    });
    bindSlider(
      "tk-fontsize-slider",
      FONT_RANGE,
      "--tk-title-size",
      function (v) {
        return v.toFixed(2) + "rem";
      },
    );
  }

  function boot(): void {
    document.querySelectorAll<HTMLElement>(".tk-demo").forEach(function (el) {
      initTokensDemo(el);
    });
  }

  boot();
  document.addEventListener("astro:page-load", boot);
  document.addEventListener("astro:after-swap", boot);
})();
