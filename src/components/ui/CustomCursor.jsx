"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const inner = innerRef.current;
    if (!cursor || !inner) return;

    // Create liquid trail elements (double-bezel trail architecture)
    const trails = [];
    for (let i = 0; i < 6; i++) {
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      document.body.appendChild(trail);
      trails.push(trail);
    }

    const onMouseMove = (e) => {
      // Only translate — never animate top/left/width/height (GPU-safe)
      cursor.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
      inner.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursorHover
      ) {
        cursor.classList.add("hovering");
        inner.classList.add("hovering");
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursorHover
      ) {
        cursor.classList.remove("hovering");
        inner.classList.remove("hovering");
      }
    };

    const onMouseDown = () => {
      cursor.classList.add("pressed");
      inner.classList.add("pressed");
    };

    const onMouseUp = () => {
      cursor.classList.remove("pressed");
      inner.classList.remove("pressed");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // Liquid trail animation — rAF only, transform + opacity only
    const animateTrails = () => {
      trails.forEach((trail, i) => {
        trail.style.transition = `all ${0.12 + i * 0.04}s cubic-bezier(0.23, 1, 0.32, 1)`;
        trail.style.left = `${mousePosX - 4}px`;
        trail.style.top = `${mousePosY - 4}px`;
        trail.style.opacity = `${1 - i * 0.14}`;
        trail.style.transform = `scale(${1 - i * 0.14})`;
      });
      requestAnimationFrame(animateTrails);
    };

    let mousePosX = 0;
    let mousePosY = 0;
    const onMouseMoveTrack = (e) => {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMoveTrack);
    animateTrails();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMoveTrack);
      trails.forEach((trail) => trail.remove());
    };
  }, []);

  return (
    <>
      {/* Outer shell — double-bezel architecture */}
      <div
        ref={cursorRef}
        className="custom-cursor custom-cursor-outer hidden md:block"
      />
      {/* Inner core — liquid core */}
      <div
        ref={innerRef}
        className="custom-cursor custom-cursor-inner hidden md:block"
      />
    </>
  );
}
