"use client";

import { useEffect, useRef, RefObject } from "react";

export function useAudioVisualizer(
  canvasRef: RefObject<HTMLCanvasElement>,
  isPlaying: boolean
) {
  const animationRef = useRef<number>(0);
  const barsRef = useRef<number[]>(new Array(50).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barCount = 50;
      const gap = 2;
      const barWidth = (width - gap * (barCount - 1)) / barCount;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < barCount; i++) {
        const target = isPlaying
          ? Math.random() * height * 0.8 + height * 0.05
          : height * 0.03;

        barsRef.current[i] += (target - barsRef.current[i]) * 0.15;

        const barHeight = Math.max(2, barsRef.current[i]);
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        const progress = i / (barCount - 1);
        const r = Math.round(63 + (160 - 63) * progress);
        const g = Math.round(208 + (107 - 208) * progress);
        const b = Math.round(201 + (255 - 201) * progress);

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationRef.current);
  }, [canvasRef, isPlaying]);
}
