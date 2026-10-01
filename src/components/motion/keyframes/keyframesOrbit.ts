const MODES = { normal: 5000, slow: 14000 } as const;
// Duración del transition (ms) en cada modo
const TRANS_MS = { normal: 600, slow: 1800 } as const;
// Cuánto tiempo (ms) se marca el 0% al arrancar cada vuelta
const HOME_MS = { normal: 350, slow: 900 } as const;
// Caja (40px) + margen de 10px a cada lado
const BOX_SPACE = 60;

type Mode = keyof typeof MODES;
type Kind = "keyframes" | "transition";

export function initOrbit() {
  const root = document.querySelector<HTMLElement>(
    "[data-orbit]:not([data-bound])",
  );
  if (!root) return;
  root.dataset.bound = "true";

  const box = root.querySelector<HTMLElement>("[data-orbit-box]")!;
  const stage = root.querySelector<HTMLElement>("[data-orbit-stage]")!;
  const lines = root.querySelectorAll<HTMLElement>("[data-orbit-line]");
  const durLabel = root.querySelector<HTMLElement>("[data-orbit-dur]")!;
  const tDurLabel = root.querySelector<HTMLElement>("[data-orbit-tdur]")!;
  const travelLabels = root.querySelectorAll<HTMLElement>(
    "[data-orbit-travel]",
  );
  const tabs = root.querySelectorAll<HTMLButtonElement>("[data-orbit-mode]");
  const typeTabs =
    root.querySelectorAll<HTMLButtonElement>("[data-orbit-type]");
  const codes = root.querySelectorAll<HTMLElement>("[data-orbit-code]");
  const hint = root.querySelector<HTMLElement>("[data-orbit-hint]")!;
  const pauseBtn = root.querySelector<HTMLButtonElement>("[data-orbit-pause]")!;

  let mode: Mode = "slow";
  let kind: Kind = "keyframes";
  let anim: Animation | undefined;
  let raf = 0;
  let current = -1;
  let userPaused = false;
  let visible = true;
  let travelX = 0;
  let travelY = 0;

  function measure() {
    travelX = Math.max(60, stage.clientWidth - BOX_SPACE);
    travelY = Math.max(60, stage.clientHeight - BOX_SPACE);
  }

  function updateTravelLabels() {
    travelLabels.forEach((el) => {
      el.textContent = String(
        el.dataset.orbitTravel === "y" ? travelY : travelX,
      );
    });
  }

  function applyPlayState() {
    if (!anim || kind !== "keyframes") return;
    if (userPaused || !visible) anim.pause();
    else anim.play();
  }

  function build(keepTime = false) {
    const prevTime = keepTime && anim ? anim.currentTime : null;
    anim?.cancel();
    anim = undefined;

    measure();
    updateTravelLabels();

    // Transition: solo variables CSS + clase, sin Web Animations
    if (kind === "transition") {
      stage.style.setProperty("--tx", `${travelX}px`);
      stage.style.setProperty("--ty", `${travelY}px`);
      stage.style.setProperty("--tdur", `${TRANS_MS[mode]}ms`);
      tDurLabel.textContent = `${TRANS_MS[mode] / 1000}s`;
      return;
    }

    const ease = "ease-in-out";
    anim = box.animate(
      [
        { transform: "translate(0, 0)", offset: 0, easing: ease },
        {
          transform: `translate(${travelX}px, 0)`,
          offset: 0.25,
          easing: ease,
        },
        {
          transform: `translate(${travelX}px, ${travelY}px)`,
          offset: 0.5,
          easing: ease,
        },
        {
          transform: `translate(0, ${travelY}px)`,
          offset: 0.75,
          easing: ease,
        },
        { transform: "translate(0, 0)", offset: 1 },
      ],
      { duration: MODES[mode], iterations: Infinity, easing: "linear" },
    );
    if (prevTime !== null) anim.currentTime = prevTime;

    durLabel.textContent = `${MODES[mode] / 1000}s`;
    current = -1;
    applyPlayState();
  }

  // lit = índice de la línea de código marcada (0..4)
  function paint(lit: number) {
    lines.forEach((l, i) => l.classList.toggle("is-active", i === lit));
  }

  function tick() {
    if (!root!.isConnected) {
      io.disconnect();
      ro.disconnect();
      return;
    }
    if (kind === "keyframes" && anim) {
      const dur = MODES[mode];
      const t = (Number(anim.currentTime) || 0) % dur;
      const seg = Math.min(3, Math.floor((t / dur) * 4));
      // Al arrancar la vuelta se marca el 0%; después, siempre el destino
      const lit = t < HOME_MS[mode] ? 0 : seg + 1;
      if (lit !== current) {
        current = lit;
        paint(lit);
      }
    }
    raf = requestAnimationFrame(tick);
  }

  typeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      kind = (tab.dataset.orbitType as Kind) ?? "keyframes";
      root.dataset.kind = kind;
      typeTabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      codes.forEach((c) => (c.hidden = c.dataset.orbitCode !== kind));
      pauseBtn.disabled = kind === "transition";
      hint.hidden = kind !== "transition";
      box.classList.remove("is-moved");
      if (kind === "transition") paint(-1);
      build();
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mode = (tab.dataset.orbitMode as Mode) ?? "slow";
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      build();
    });
  });

  pauseBtn.addEventListener("click", () => {
    userPaused = !userPaused;
    pauseBtn.setAttribute("aria-label", userPaused ? "Reanudar" : "Pausar");
    pauseBtn.classList.toggle("is-paused", userPaused);
    applyPlayState();
  });

  // En Transition, el click en el recuadro lleva la caja de A a B (y vuelve)
  stage.addEventListener("click", () => {
    if (kind === "transition") box.classList.toggle("is-moved");
  });

  // Si cambia el tamaño del stage (rotar el celu, resize), recalcula el recorrido
  const ro = new ResizeObserver(() => {
    if (!stage.clientWidth) return;
    const x = Math.max(60, stage.clientWidth - BOX_SPACE);
    const y = Math.max(60, stage.clientHeight - BOX_SPACE);
    if (x !== travelX || y !== travelY) build(true);
  });

  // Pausa todo (animación + rAF) cuando no está en pantalla
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
      applyPlayState();
    },
    { rootMargin: "200px" },
  );

  build();
  ro.observe(stage);
  io.observe(root);
}
