"use client";
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// DotMatrixBackground — React wrapper for the vanilla canvas dot-matrix engine
// Full-page fixed canvas (z-index 0), pointer events pass through.
// ---------------------------------------------------------------------------

export function DotMatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Minimal in-component engine (vanilla JS, no dependencies)
    const ctx = canvas.getContext("2d", { alpha: false });
    let dpr = 1;
    let width = 0;
    let height = 0;
    let frameId = null;
    let lastTime = null;
    let running = true;

    const colors = {
      bg: "#080808",
      silver: "#CDCBCA",
      red: "#C8102E",
    };

    const readColors = () => {
      const root = getComputedStyle(document.documentElement);
      const g = (name, fallback) => {
        const v = root.getPropertyValue(name).trim();
        return v ? v : fallback;
      };
      colors.bg = g("--dg-bg-deep", "#080808");
      colors.silver = g("--dg-high", "#CDCBCA");
      colors.red = g("--dg-accent-p", "#C8102E");
    };

    readColors();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mq.matches;
    const onReduce = () => {
      reducedMotion = mq.matches;
    };
    mq.addEventListener("change", onReduce);

    const dots = [];
    let cols = 0;
    let rows = 0;
    let spacing = 0;

    const pointer = { x: null, y: null, active: false };
    const scroll = { y: 0, glitch: 0 };
    let time = 0;

    const isMobile = () => window.innerWidth < 768;

    const resize = () => {
      const dp = Math.min(window.devicePixelRatio || 1, 2);
      dpr = dp;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      spacing = isMobile() ? 44 : 28;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;

      const newDots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gx = c * spacing + spacing * 0.5 + (Math.random() - 0.5) * 2;
          const gy = r * spacing + spacing * 0.5 + (Math.random() - 0.5) * 2;
          newDots.push({
            gx, gy,
            x: gx, y: gy,
            tx: gx, ty: gy,
            vx: 0, vy: 0,
            size: 2.5 * (0.8 + Math.random() * 0.6),
            alpha: 0.5 + Math.random() * 0.5,
            red: Math.random() < 0.06,
          });
        }
      }
      dots.length = 0;
      dots.push(...newDots);
    };

    const onPointerMove = (e) => {
      if (reducedMotion) return;
      const pt = e.touches ? e.touches[0] : e;
      pointer.x = pt.clientX;
      pointer.y = pt.clientY;
      pointer.active = true;
    };
    const onPointerDown = () => { pointer.active = true; };
    const onPointerUp = () => { pointer.active = false; };
    const onPointerLeave = () => { pointer.active = false; };
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - scroll.y);
      scroll.y = window.scrollY;
      if (!reducedMotion && delta > 0) {
        scroll.glitch += delta * 1.6;
        scroll.glitch = Math.min(scroll.glitch, 32);
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchstart", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("mouseup", onPointerUp, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave, { passive: true });
    window.addEventListener("touchend", onPointerLeave, { passive: true });

    resize();

    const animate = (now) => {
      if (!running) return;
      frameId = requestAnimationFrame((t) => animate(t));

      const dt = lastTime ? now - lastTime : 16;
      lastTime = now;
      time += dt;

      // decay glitch
      scroll.glitch *= 0.92;
      if (Math.abs(scroll.glitch) < 0.05) scroll.glitch = 0;

      const px = pointer.x;
      const py = pointer.y;
      const active = pointer.active && !reducedMotion;
      const glitch = scroll.glitch;
      const t = time * 0.001;

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);

      for (const dot of dots) {
        // target with glitch
        if (glitch > 0.5) {
          const gxOff = Math.sin(dot.gx * 0.03 + dot.gy * 0.03 + t + glitch) * glitch * 0.4;
          const gyOff = Math.cos(dot.gx * 0.03 - dot.gy * 0.03 - t + glitch) * glitch * 0.4;
          dot.tx = dot.gx + gxOff;
          dot.ty = dot.gy + gyOff;
        } else {
          dot.tx = dot.gx;
          dot.ty = dot.gy;
        }

        // pointer repulsion
        if (active && px != null) {
          const dx = dot.x - px;
          const dy = dot.y - py;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 0) {
            const force = (1 - dist / 140) * 2.6;
            dot.vx += (dx / dist) * force;
            dot.vy += (dy / dist) * force;
          }
        }

        dot.vx *= 0.88;
        dot.vy *= 0.88;
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.x += (dot.tx - dot.x) * 0.14;
        dot.y += (dot.ty - dot.y) * 0.14;

        let color = dot.red ? colors.red : colors.silver;
        if (active && px != null) {
          const dist = Math.hypot(dot.x - px, dot.y - py);
          if (dist < 110) color = colors.red;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = dot.alpha;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    lastTime = performance.now();
    frameId = requestAnimationFrame(animate);

    return () => {
      running = false;
      if (frameId) cancelAnimationFrame(frameId);
      mq.removeEventListener("change", onReduce);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchstart", onPointerMove);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("touchend", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none block"
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
}
