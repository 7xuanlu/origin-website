"use client";

import { useCallback, type PointerEvent, type ReactNode } from "react";

type SpotlightProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Tracks the cursor across descendant `.card-wenlan` links so their
 * spotlight follows it. Position custom properties inherit, so one wrapper
 * covers a whole grid. Cards without a tracked position fall back to the
 * default glow position declared in CSS.
 */
export function Spotlight({ className, children }: SpotlightProps) {
  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      const card = target.closest("a.card-wenlan, button.card-wenlan");
      if (!(card instanceof HTMLElement)) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    },
    [],
  );

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
