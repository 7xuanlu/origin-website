"use client";

import { useEffect } from "react";

/** Progressive enhancement: content is visible in SSR and without observers.
 * Entry motion establishes section hierarchy; it never drives scroll position. */
export function HomeMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || typeof IntersectionObserver === "undefined") return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        // Existing core diagrams own their own internal choreography.
        const target = entry.target.matches('[data-home-reveal="section"]')
          ? entry.target.querySelector("h2") : entry.target;
        if (!(target instanceof HTMLElement) || reduce.matches) continue;
        const animation = target.animate(
          [{ opacity: 0.55, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.08 });
    document.querySelectorAll(".home-page [data-home-reveal]").forEach((el) => observer.observe(el));
    const stop = () => { if (reduce.matches) animations.forEach((animation) => animation.cancel()); };
    reduce.addEventListener("change", stop);
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); reduce.removeEventListener("change", stop); };
  }, []);
  return null;
}
