"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/** Simple scroll-triggered reveal with stagger */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const animated = el.querySelectorAll(".scroll-fade-up, .scroll-emerge, .num-glow");
          animated.forEach((child) => {
            const delay = parseInt(child.getAttribute("data-delay") || "0", 10);
            setTimeout(() => child.classList.add("visible"), delay);
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Returns a scroll progress value (0-1) for how far an element
 * has traveled through the viewport.
 * 0 = element top just entered viewport bottom
 * 1 = element top has reached viewport top
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;

    // progress: 0 when element top is at viewport bottom, 1 when at viewport top
    const raw = 1 - rect.top / windowH;
    setProgress(Math.max(0, Math.min(1, raw)));
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [update]);

  return { ref, progress };
}
