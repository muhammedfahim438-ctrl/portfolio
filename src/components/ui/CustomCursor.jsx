"use client";

import { useEffect, useRef } from "react";

/**
 * CustomCursor - dot-matrix reticle.
 * A red center dot tracks the pointer exactly; a yellow corner-bracket ring
 * trails behind with lerped easing. Pointer-fine devices only. The native
 * cursor is hidden while mounted via the `dg-cursor-on` class on <html>.
 */
export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("dg-cursor-on");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let rafId = 0;

    const place = (el, x, y) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      place(dot, targetX, targetY);
      if (reduced) place(ring, targetX, targetY);
    };

    const tick = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      place(ring, ringX, ringY);
      rafId = requestAnimationFrame(tick);
    };

    const isInteractive = (t) =>
      t instanceof Element &&
      Boolean(t.closest("a, button, [data-cursor], input, select, textarea, label"));

    const onMouseOver = (e) => {
      if (isInteractive(e.target)) ring.classList.add("is-hovering");
    };
    const onMouseOut = (e) => {
      if (isInteractive(e.target)) ring.classList.remove("is-hovering");
    };
    const onMouseDown = () => ring.classList.add("is-pressed");
    const onMouseUp = () => ring.classList.remove("is-pressed");
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    place(dot, targetX, targetY);
    place(ring, ringX, ringY);
    if (!reduced) rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("dg-cursor-on");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* red center dot, exact tracking */}
      <div ref={dotRef} aria-hidden="true" className="dg-cursor-dot" />
      {/* trailing corner-bracket ring */}
      <div ref={ringRef} aria-hidden="true" className="dg-cursor-ring">
        <div className="dg-cursor-ring-inner">
          <span className="dg-cursor-tick dg-cursor-tick--tl" />
          <span className="dg-cursor-tick dg-cursor-tick--tr" />
          <span className="dg-cursor-tick dg-cursor-tick--bl" />
          <span className="dg-cursor-tick dg-cursor-tick--br" />
        </div>
      </div>
    </>
  );
}
