"use client";
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// SorvineBackground — full-page HTML5 Canvas particle background
// Three scroll-scenes: Neural Network -> Circuit Flow -> Orbiting Core
// Vanilla JavaScript canvas only, no external libraries.
// ---------------------------------------------------------------------------

const MORPH_FRAMES = 90; // smooth morph window (within 60-120)
const REPEL_RADIUS = 180;
const REPEL_STRENGTH = 3.5;
const FRICTION = 0.88;
const RETURN_SPRING = 0.06;
const CONNECT_THRESHOLD = 140;

const isMobile = () => window.innerWidth < 768;
const particleCount = () => (isMobile() ? 500 : 1000);

const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const rand = (min, max) => Math.random() * (max - min) + min;

const getCssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const hexToRgb = (hex) => {
  const m = hex.replace("#", "").match(/.{2}/g);
  return m ? m.map((v) => parseInt(v, 16)) : [205, 242, 43];
};

export function SorvineBackground() {
  // ------------------------------------------------------------------
  // Refs — all mutable animation state lives here so the render loop
  // never reassigns local component variables after mount.
  // ------------------------------------------------------------------
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const reducedMotionRef = useRef(false);
  const countRef = useRef(particleCount());
  const dprRef = useRef(window.devicePixelRatio || 1);

  const themeRef = useRef({ bg: "", surface: "", accent: "", accentRgb: [205, 242, 43] });
  const particlesRef = useRef([]);
  const targetsRef = useRef([]);
  const startBaseRef = useRef([]);
  const sceneRef = useRef(1);
  const morphRef = useRef(1);
  const morphingRef = useRef(false);
  const tracesSnapshotRef = useRef([]);

  // ------------------------------------------------------------------
  // Scroll progress (Lenis when available, else window.scrollY)
  // ------------------------------------------------------------------
  const getScrollProgress = () => {
    const lenis = window.__lenis;
    const y = lenis && typeof lenis.animatedScroll === "number"
      ? lenis.animatedScroll
      : window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(1, y / max));
  };

  const sceneFromProgress = (p) => (p < 1 / 3 ? 1 : p < 2 / 3 ? 2 : 3);

  // ------------------------------------------------------------------
  // Theme colors
  // ------------------------------------------------------------------
  const refreshColors = () => {
    themeRef.current = {
      bg: getCssVar("--themeBg"),
      surface: getCssVar("--themeSurface"),
      accent: getCssVar("--themeAccent"),
      accentRgb: hexToRgb(getCssVar("--themeAccent")),
    };
  };

  // ------------------------------------------------------------------
  // Target generators (exactly `count` entries per scene)
  // ------------------------------------------------------------------
  const buildNeuralTargets = (count, w, h) => {
    const mx = w * 0.08;
    const my = h * 0.08;
    const nodes = [];
    const nodeCount = Math.max(12, Math.floor(count * 0.22));
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: rand(mx, w - mx),
        y: rand(my, h - my),
        r: rand(2.5, 5.5),
        role: "node",
      });
    }

    const targets = [];
    for (let i = 0; i < nodeCount && targets.length < count; i++) {
      targets.push({ ...nodes[i], role: "node" });
    }
    let edgeIdx = 0;
    while (targets.length < count) {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      const b = nodes[Math.floor(Math.random() * nodes.length)];
      if (a === b) continue;
      const t = (edgeIdx % 7) / 7;
      targets.push({
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        r: rand(0.8, 1.8),
        role: "edge",
      });
      edgeIdx++;
    }
    return targets.slice(0, count);
  };

  const buildCircuitTargets = (count, w, h) => {
    const mx = w * 0.06;
    const my = h * 0.06;
    const traces = [];
    const vLines = 6;
    const hLines = 5;
    for (let i = 0; i < vLines; i++) {
      const x = lerp(mx, w - mx, i / Math.max(1, vLines - 1));
      for (let y = my; y < h - my; y += 40) {
        traces.push({ x1: x, y1: y, x2: x, y2: Math.min(y + 24, h - my), dir: "v" });
      }
    }
    for (let i = 0; i < hLines; i++) {
      const y = lerp(my, h - my, i / Math.max(1, hLines - 1));
      for (let x = mx; x < w - mx; x += 56) {
        traces.push({ x1: x, y1: y, x2: Math.min(x + 32, w - mx), y2: y, dir: "h" });
      }
    }

    const targets = [];
    const perTrace = Math.max(1, Math.floor(count / traces.length)) || 1;
    let ti = 0;
    while (targets.length < count && traces.length) {
      const tr = traces[ti % traces.length];
      const t = (targets.length % perTrace) / Math.max(1, perTrace - 1 || 1);
      targets.push({
        x: lerp(tr.x1, tr.x2, t),
        y: lerp(tr.y1, tr.y2, t),
        r: rand(1.0, 2.2),
        role: "trace",
        tx: tr.x2 - tr.x1,
        ty: tr.y2 - tr.y1,
        seg: ti % traces.length,
      });
      ti++;
      if (ti > traces.length * 3 && targets.length < count) {
        targets.push({ x: rand(mx, w - mx), y: rand(my, h - my), r: 1.2, role: "trace" });
      }
    }
    return targets.slice(0, count);
  };

  const buildOrbitTargets = (count, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const targets = [];
    const rings = 5;
    const perRing = Math.floor(count / rings);
    for (let ring = 0; ring < rings; ring++) {
      const radius = 60 + ring * 52;
      for (let i = 0; i < perRing && targets.length < count; i++) {
        const angle = (i / perRing) * Math.PI * 2 + ring * 0.7;
        targets.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          r: rand(1.0, 2.4),
          role: "ring",
          ringIndex: ring,
          baseAngle: angle,
          orbitRadius: radius,
          orbitSpeed: 0.0004 + ring * 0.0002,
          cx,
          cy,
        });
      }
    }
    while (targets.length < count) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + 4 * 52;
      targets.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        r: 1.4,
        role: "ring",
        ringIndex: 4,
        baseAngle: angle,
        orbitRadius: radius,
        orbitSpeed: 0.0014,
        cx,
        cy,
      });
    }
    return targets.slice(0, count);
  };

  const buildTargets = (scene, w, h) => {
    if (scene === 1) return buildNeuralTargets(countRef.current, w, h);
    if (scene === 2) return buildCircuitTargets(countRef.current, w, h);
    return buildOrbitTargets(countRef.current, w, h);
  };

  const initParticles = () => {
    const count = countRef.current;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({ x: 0, y: 0, baseX: 0, baseY: 0, vx: 0, vy: 0, r: 1, phase: Math.random() });
    }
    particlesRef.current = arr;
    targetsRef.current = buildTargets(
      sceneRef.current,
      canvasRef.current.width / dprRef.current,
      canvasRef.current.height / dprRef.current
    );
    startBaseRef.current = arr.map(() => ({ x: 0, y: 0 }));
    morphRef.current = 1;
    morphingRef.current = false;
    arr.forEach((p, i) => {
      const t = targetsRef.current[i] || targetsRef.current[0];
      p.baseX = p.x = t.x;
      p.baseY = p.y = t.y;
      p.r = t.r;
      p.role = t.role;
      p.ringIndex = t.ringIndex;
      p.baseAngle = t.baseAngle;
      p.orbitRadius = t.orbitRadius;
      p.orbitSpeed = t.orbitSpeed;
      p.cx = t.cx;
      p.cy = t.cy;
      p.tx = t.tx;
      p.ty = t.ty;
      p.seg = t.seg;
    });
  };

  const beginMorph = (newScene) => {
    if (newScene === sceneRef.current && !morphingRef.current) return;
    sceneRef.current = newScene;
    startBaseRef.current = particlesRef.current.map((p) => ({ x: p.baseX, y: p.baseY }));
    targetsRef.current = buildTargets(
      newScene,
      canvasRef.current.width / dprRef.current,
      canvasRef.current.height / dprRef.current
    );
    particlesRef.current.forEach((p, i) => {
      const t = targetsRef.current[i] || targetsRef.current[0];
      p.r = t.r;
      p.role = t.role;
      p.ringIndex = t.ringIndex;
      p.baseAngle = t.baseAngle;
      p.orbitRadius = t.orbitRadius;
      p.orbitSpeed = t.orbitSpeed;
      p.cx = t.cx;
      p.cy = t.cy;
      p.tx = t.tx;
      p.ty = t.ty;
      p.seg = t.seg;
    });
    morphRef.current = 0;
    morphingRef.current = true;
  };

  // ------------------------------------------------------------------
  // Pointer / touch interaction (window listeners because the canvas
  // itself has pointer-events: none and sits behind page content)
  // ------------------------------------------------------------------
  const onPointerMove = (e) => {
    if (reducedMotionRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) * dprRef.current,
      y: (e.clientY - rect.top) * dprRef.current,
      active: true,
    };
  };

  const onTouchMove = (e) => {
    if (reducedMotionRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches[0];
    mouseRef.current = {
      x: (t.clientX - rect.left) * dprRef.current,
      y: (t.clientY - rect.top) * dprRef.current,
      active: true,
    };
  };

  const onTouchEnd = () => {
    mouseRef.current.active = false;
  };

  // ------------------------------------------------------------------
  // Resize / Retina
  // ------------------------------------------------------------------
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    dprRef.current = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dprRef.current;
    canvas.height = h * dprRef.current;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    countRef.current = particleCount();
    refreshColors();
    initParticles();
    rebuildTracesSnapshot();
  };

  const rebuildTracesSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width / dprRef.current;
    const h = canvas.height / dprRef.current;
    const mx = w * 0.06;
    const my = h * 0.06;
    const traces = [];
    const vLines = 6;
    const hLines = 5;
    for (let i = 0; i < vLines; i++) {
      const x = lerp(mx, w - mx, i / Math.max(1, vLines - 1));
      for (let y = my; y < h - my; y += 40) {
        traces.push({ x1: x, y1: y, x2: x, y2: Math.min(y + 24, h - my) });
      }
    }
    for (let i = 0; i < hLines; i++) {
      const y = lerp(my, h - my, i / Math.max(1, hLines - 1));
      for (let x = mx; x < w - mx; x += 56) {
        traces.push({ x1: x, y1: y, x2: Math.min(x + 32, w - mx), y2: y });
      }
    }
    tracesSnapshotRef.current = traces;
  };

  // ------------------------------------------------------------------
  // Animation frame
  // ------------------------------------------------------------------
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext("2d");
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const dw = w / dprRef.current;
    const dh = h / dprRef.current;
    const { bg, surface, accent, accentRgb } = themeRef.current;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const progress = getScrollProgress();
    const scene = sceneFromProgress(progress);
    if (!morphingRef.current && scene !== sceneRef.current) {
      beginMorph(scene);
    }

    // Morph interpolation factor (easeInOutCubic(1) === 1 when idle)
    const t = easeInOutCubic(morphRef.current);
    if (morphingRef.current) {
      morphRef.current += 1 / MORPH_FRAMES;
      if (morphRef.current >= 1) {
        morphRef.current = 1;
        morphingRef.current = false;
      }
    }

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const mouseActive = mouseRef.current.active && !reducedMotionRef.current;
    const particles = particlesRef.current;
    const targets = targetsRef.current;
    const startBase = startBaseRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const tgt = targets[i] || targets[0];
      const sb = startBase[i] || { x: p.baseX, y: p.baseY };

      // Interpolated base position (the morph)
      p.baseX = lerp(sb.x, tgt.x, t);
      p.baseY = lerp(sb.y, tgt.y, t);

      let x = p.baseX;
      let y = p.baseY;

      // Scene-specific motion
      if (!reducedMotionRef.current) {
        if (sceneRef.current === 3 && p.role === "ring") {
          p.baseAngle = (p.baseAngle || 0) + p.orbitSpeed;
          x = p.cx + Math.cos(p.baseAngle) * p.orbitRadius;
          y = p.cy + Math.sin(p.baseAngle) * p.orbitRadius;
        } else if (sceneRef.current === 2 && p.role === "trace") {
          p.phase = (p.phase || 0) + 0.015;
          const traces = tracesSnapshotRef.current;
          const seg = traces[p.seg % traces.length];
          if (seg) {
            const tt = ((p.phase * 0.5) % 1 + 1) % 1;
            x = lerp(seg.x1, seg.x2, tt) * dprRef.current;
            y = lerp(seg.y1, seg.y2, tt) * dprRef.current;
          }
        }
      }

      // Pointer repulsion force field
      if (mouseActive) {
        const dx = x - mx;
        const dy = y - my;
        const d = Math.hypot(dx, dy);
        if (d < REPEL_RADIUS && d > 0) {
          const force = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }

      x += p.vx;
      y += p.vy;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      x += (p.baseX - x) * RETURN_SPRING;
      y += (p.baseY - y) * RETURN_SPRING;

      p.x = x;
      p.y = y;

      const r = p.r * dprRef.current;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = reducedMotionRef.current ? 0.15 : 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(x, y, r * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentRgb[0]},${accentRgb[1]},${accentRgb[2]},0.12)`;
      ctx.fill();
    }

    // Scene 1: synapse connections between nearby nodes (accent at ~10% intensity)
    if (!reducedMotionRef.current && sceneRef.current === 1) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1 * dprRef.current;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (a.role !== "node") continue;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (b.role !== "node") continue;
          const d = dist(a.x, a.y, b.x, b.y);
          const threshold = CONNECT_THRESHOLD * dprRef.current;
          if (d < threshold) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.globalAlpha = 0.1 * (1 - d / threshold);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    // Scene 3: central core sphere
    if (!reducedMotionRef.current && sceneRef.current === 3) {
      const cx = (dw / 2) * dprRef.current;
      const cy = (dh / 2) * dprRef.current;
      const coreR = 44 * dprRef.current;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = surface;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 1.7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${accentRgb[0]},${accentRgb[1]},${accentRgb[2]},0.18)`;
      ctx.lineWidth = 2 * dprRef.current;
      ctx.stroke();
    }

    rafRef.current = requestAnimationFrame(animate);
  };

  // ------------------------------------------------------------------
  // Effects — runs once on mount. All mutable animation state is
  // ref-based; the render-scoped functions are stable for this prop-less,
  // state-less component's single mount.
  // ------------------------------------------------------------------
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    refreshColors();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onReduce = () => {
      reducedMotionRef.current = mq.matches;
    };
    mq.addEventListener("change", onReduce);

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    handleResize();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      mq.removeEventListener("change", onReduce);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          display: "block",
        }}
      />
    </div>
  );
}
