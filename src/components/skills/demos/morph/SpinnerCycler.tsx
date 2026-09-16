import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Arc,
  BouncingDots,
  CircularDots,
  Classic,
  ClassicV2,
  Clock,
  Comet,
  Compass,
  LinearDots,
  Orbit,
  Pulse,
  Ring,
  Swirl,
} from "loading-dev";
import { translations } from "../../../../data/translations";

type SpinnerEntry = {
  name: string;
  Component: React.ComponentType<{ size?: number }>;
};

const SPINNERS: SpinnerEntry[] = [
  { name: "LinearDots", Component: LinearDots },
  { name: "Arc", Component: Arc },
  { name: "Classic", Component: Classic },
  { name: "ClassicV2", Component: ClassicV2 },
  { name: "Ring", Component: Ring },
  { name: "BouncingDots", Component: BouncingDots },
  { name: "Comet", Component: Comet },
  { name: "Orbit", Component: Orbit },
  { name: "Clock", Component: Clock },
  { name: "CircularDots", Component: CircularDots },
  { name: "Pulse", Component: Pulse },
  { name: "Compass", Component: Compass },
  { name: "Swirl", Component: Swirl },
];

function getPhrases(): string[] {
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("lang") : null;
  const isEn =
    stored === "en" ||
    (typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-lang") === "en");
  const lang = isEn ? "en" : "es";
  const labels = (translations as any)[lang]?.skillsPage?.morphDemo?.labels;
  if (Array.isArray(labels) && labels.length) return labels as string[];
  return isEn
    ? ["Cogitating...", "Compiling...", "Investigating...", "Synthesizing..."]
    : ["Cavilando...", "Compilando...", "Investigando...", "Sintetizando..."];
}

export default function SpinnerCycler() {
  const [index, setIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phrases, setPhrases] = useState<string[]>(() =>
    typeof window !== "undefined" ? getPhrases() : (translations as any).es.skillsPage.morphDemo.labels,
  );
  const [labelClass, setLabelClass] = useState("morph-label morph-label--in");
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // keep phrases in sync with lang changes
  useEffect(() => {
    const sync = () => setPhrases(getPhrases());
    // initial
    sync();
    document.addEventListener("langchange", sync);
    document.addEventListener("astro:page-load", sync);
    return () => {
      document.removeEventListener("langchange", sync);
      document.removeEventListener("astro:page-load", sync);
    };
  }, []);

  // when phrases change (lang switch) keep index in bounds
  useEffect(() => {
    setPhraseIndex((prev) => prev % phrases.length);
  }, [phrases]);

  // auto-cycle phrases: cae de arriba (Claude-like)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cycle = () => {
      setLabelClass("morph-label morph-label--out");
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        // start from top
        setLabelClass("morph-label morph-label--enter");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setLabelClass("morph-label morph-label--in");
          });
        });
      }, 280);
    };

    intervalRef.current = window.setInterval(cycle, 2000);

    const handleVisibility = () => {
      if (document.hidden) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
      } else {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(cycle, 2000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [phrases.length]);

  const advanceSpinner = useCallback(() => {
    setIndex((prev) => (prev + 1) % SPINNERS.length);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      advanceSpinner();
    }
  };

  const { Component } = SPINNERS[index];

  return (
    <div className="morph-main">
      <div
        role="button"
        tabIndex={0}
        aria-label="Cambiar animación de carga"
        onClick={advanceSpinner}
        onKeyDown={handleKeyDown}
        className="morph-icon"
      >
        <Component size={20} />
      </div>
      <span className="morph-label-viewport" aria-live="polite" aria-atomic="true">
        <span className={labelClass}>{phrases[phraseIndex]}</span>
      </span>
    </div>
  );
}
