"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getHeroData, getConfig } from "@/lib/firestore";

const DEFAULT_PHOTO = "/my-picture.png";

export function AnimatedPortrait({ className = "" }) {
  const [photos, setPhotos] = useState([]);
  const [imgFailed, setImgFailed] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const wrapRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 180, damping: 20 });
  const glareX = useTransform(mx, [-0.5, 0.5], [15, 85]);
  const glareY = useTransform(my, [-0.5, 0.5], [15, 85]);

  function handleMove(e) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [hero, config] = await Promise.all([
          getHeroData(),
          getConfig("portrait_data", null),
        ]);
        if (!mounted) return;
        const list = [];
        if (hero?.photo_url) list.push(hero.photo_url);
        if (config?.photos?.length) {
          config.photos.forEach((p) => p && list.push(p));
        }
        if (list.length) setPhotos([...new Set(list)]);
      } catch {
        // fallback below
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (photos.length <= 1) return;
    const iv = setInterval(() => setImgIdx((i) => (i + 1) % photos.length), 5200);
    return () => clearInterval(iv);
  }, [photos.length]);

  const useBundled = !photos.length;
  const activeSrc = useBundled ? DEFAULT_PHOTO : photos[imgIdx];

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className={`relative ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* glow ring */}
      <div className="absolute -inset-1 rounded-[inherit] bg-gradient-to-br from-themeAccent/30 to-themeSecondary/25 blur-2xl" />

      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[inherit] border border-themeBorder bg-themeSurface"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* desaturated duotone base layer */}
        <div className="absolute inset-0 z-[2] bg-linear-to-br from-themeAccent/25 via-transparent to-themeSecondary/20 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_30%_25%,rgba(255,200,150,0.16),transparent_45%)] mix-blend-screen pointer-events-none" />

        {useBundled ? (
          <picture className="absolute inset-0 z-[1]">
            <source srcSet="/my-picture-avif.avif" type="image/avif" />
            <source srcSet="/my-picture.webp" type="image/webp" />
            <img
              src={DEFAULT_PHOTO}
              alt="Muhammed Fahim M"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          </picture>
        ) : (
          photos.map((p, i) => (
            <img
              key={p}
              src={imgFailed ? DEFAULT_PHOTO : p}
              alt="Muhammed Fahim M"
              onError={() => setImgFailed((prev) => prev || i === imgIdx)}
              className="absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-1000"
              style={{ opacity: i === imgIdx ? 1 : 0 }}
            />
          ))
        )}

        {/* moving glare follows cursor */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{ "--gx": glareX, "--gy": glareY, background: "radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.30), transparent 42%)", mixBlendMode: "screen" }}
        />
      </motion.div>
    </div>
  );
}
