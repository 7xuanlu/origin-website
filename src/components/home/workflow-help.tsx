"use client";

import { useId, useRef, useState } from "react";

/** Optional background: hover, keyboard focus or tap; native outside/Escape dismissal. */
export function WorkflowHelp({ name, label, children }: { name: string; label: string; children: string }) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);

  function show() {
    clearTimeout(leaveTimer.current);
    if (!button.current || !panel.current) return;
    const bounds = button.current.getBoundingClientRect();
    panel.current.showPopover();
    const width = panel.current.offsetWidth;
    const height = panel.current.offsetHeight;
    panel.current.style.left = `${Math.max(16, Math.min(bounds.left + bounds.width / 2 - width / 2, innerWidth - width - 16))}px`;
    panel.current.style.top = `${Math.max(16, Math.min(bounds.bottom + 8, innerHeight - height - 16))}px`;
  }

  function hide() {
    clearTimeout(leaveTimer.current);
    if (panel.current?.matches(":popover-open")) panel.current.hidePopover();
  }

  return <span className="workflow-help" onPointerEnter={show} onPointerLeave={() => {
    leaveTimer.current = setTimeout(() => {
      if (document.activeElement !== button.current) hide();
    }, 120);
  }}>
    <button ref={button} type="button" className="workflow-help-trigger" aria-label={label}
      aria-describedby={open ? id : undefined} aria-expanded={open}
      onFocus={show} onClick={show} onBlur={hide} onKeyDown={(event) => {
        if (event.key === "Escape") hide();
      }}>{name}</button>
    <div ref={panel} id={id} role="tooltip" popover="auto" className="workflow-help-popover"
      onToggle={(event) => setOpen(event.newState === "open")}>{children}</div>
  </span>;
}
