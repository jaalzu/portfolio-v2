import { WORKING_ICONS } from "./icons";
import { translations } from "../../../../data/translations";

type Point = [number, number];
type SampledSubpath = { pts: Point[]; centroid: Point };

let sharedMeasurePath: SVGPathElement | null = null;

function getMeasurePath(): SVGPathElement {
  if (sharedMeasurePath) return sharedMeasurePath;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";
  svg.style.pointerEvents = "none";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.appendChild(path);
  document.body.appendChild(svg);
  sharedMeasurePath = path;
  return path;
}

function sampleSubpath(d: string, n: number): SampledSubpath {
  const measure = getMeasurePath();
  measure.setAttribute("d", d);
  const len = measure.getTotalLength();
  const pts: Point[] = [];
  if (len === 0) {
    // fallback centroid
    for (let i = 0; i < n; i++) pts.push([128, 128]);
  } else {
    for (let i = 0; i < n; i++) {
      const p = measure.getPointAtLength((i / n) * len);
      pts.push([p.x, p.y]);
    }
  }
  const centroid: Point = pts.reduce(
    (acc, [x, y]) => [acc[0] + x / n, acc[1] + y / n],
    [0, 0] as Point,
  );
  return { pts, centroid };
}

function repeat(point: Point, n: number): Point[] {
  return Array.from({ length: n }, () => point as Point);
}

function lerpPts(a: Point[], b: Point[], t: number): Point[] {
  return a.map(([ax, ay], i) => {
    const [bx, by] = b[i];
    return [ax + (bx - ax) * t, ay + (by - ay) * t] as Point;
  });
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function buildD(subpaths: Point[][]): string {
  return subpaths
    .map((pts) => {
      const [x0, y0] = pts[0];
      let d = `M${x0.toFixed(2)},${y0.toFixed(2)}`;
      for (let i = 1; i < pts.length; i++) {
        d += `L${pts[i][0].toFixed(2)},${pts[i][1].toFixed(2)}`;
      }
      return d + "Z";
    })
    .join("");
}

export function initMorphingDemo() {
  const svg = document.getElementById("morph-svg") as SVGSVGElement | null;
  const path = document.getElementById("morph-path") as SVGPathElement | null;
  const labelEl = document.getElementById("morph-label") as HTMLElement | null;
  const root = document.getElementById("morph-root") as HTMLElement | null;
  if (!svg || !path || !labelEl || !root) return;
  if (root.dataset.bound === "1") return;
  root.dataset.bound = "1";

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const samplesPerSubpath = 28;
  const durationMs = 850;
  const autoPlayMs = 4500;
  const viewBox = "0 0 256 256";

  svg.setAttribute("viewBox", viewBox);

  const sampled = WORKING_ICONS.map((icon) => ({
    ...icon,
    samples: icon.subpaths.map((d) => sampleSubpath(d, samplesPerSubpath)),
  }));

  function getLabels(): string[] {
    const stored = localStorage.getItem("lang");
    const isEn =
      stored === "en" ||
      (!stored && document.documentElement.getAttribute("data-lang") === "en");
    const lang = isEn ? "en" : "es";
    const labels = (translations as any)[lang]?.skillsPage?.morphDemo?.labels;
    if (Array.isArray(labels) && labels.length === sampled.length)
      return labels as string[];
    return sampled.map((s) => s.label);
  }

  let index = 0;
  let animating = false;
  let intervalId: number | null = null;

  // initial render
  path.setAttribute("d", buildD(sampled[0].samples.map((s) => s.pts)));
  labelEl.textContent = getLabels()[0];
  labelEl.className = "morph-label morph-label--in";

  // update label instantly when language changes
  document.addEventListener("langchange", () => {
    labelEl!.textContent = getLabels()[index];
  });
  // also on astro page load (I18nSync applies lang after)
  document.addEventListener("astro:page-load", () => {
    labelEl!.textContent = getLabels()[index];
  });

  function goTo(nextIndex: number) {
    if (animating) return;
    const labels = getLabels();
    if (prefersReduced) {
      index = nextIndex;
      path.setAttribute(
        "d",
        buildD(sampled[nextIndex].samples.map((s) => s.pts)),
      );
      labelEl!.textContent = labels[nextIndex];
      return;
    }
    animating = true;
    const from = sampled[index];
    const to = sampled[nextIndex];
    const maxSub = Math.max(from.samples.length, to.samples.length);

    labelEl!.className = "morph-label morph-label--out";
    window.setTimeout(() => {
      labelEl!.textContent = labels[nextIndex];
      labelEl!.className = "morph-label morph-label--in";
    }, durationMs * 0.35);

    let start: number | null = null;
    function frame(ts: number) {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / durationMs, 1);
      const et = easeInOutCubic(t);
      const subpaths: Point[][] = [];
      for (let i = 0; i < maxSub; i++) {
        const fromS = from.samples[i];
        const toS = to.samples[i];
        if (fromS && toS) {
          subpaths.push(lerpPts(fromS.pts, toS.pts, et));
        } else if (fromS && !toS) {
          subpaths.push(
            lerpPts(fromS.pts, repeat(fromS.centroid, samplesPerSubpath), et),
          );
        } else if (!fromS && toS) {
          subpaths.push(
            lerpPts(repeat(toS.centroid, samplesPerSubpath), toS.pts, et),
          );
        }
      }
      path!.setAttribute("d", buildD(subpaths));
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        index = nextIndex;
        animating = false;
      }
    }
    requestAnimationFrame(frame);
  }

  function startAutoplay() {
    if (intervalId !== null) window.clearInterval(intervalId);
    intervalId = window.setInterval(() => {
      goTo((index + 1) % sampled.length);
    }, autoPlayMs);
  }

  function stopAutoplay() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  startAutoplay();

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  // Pause on hover (optional, better UX)
  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);

  // Cleanup on HMR / astro swap
  window.addEventListener("beforeunload", stopAutoplay);
}

initMorphingDemo();
document.addEventListener("astro:page-load", initMorphingDemo);
document.addEventListener("astro:after-swap", initMorphingDemo);
