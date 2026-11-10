"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]*+=#$_@0123456789";

function scrambleText(text, keep) {
  const keepLen = Math.floor(keep);
  return text
    .split("")
    .map((ch, i) => {
      if (i < keepLen) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

export function ScrambleText({
  text,
  enabled,
  className = "",
  as: Tag = "span",
  ariaLabel,
}) {
  const [scrambled, setScrambled] = useState(text);
  const timerRef = useRef(null);
  const [self, setSelf] = useState(false);
  const active = enabled !== undefined ? enabled : self;

  const display = active ? scrambled : text;

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const frames = 7;
    timerRef.current = setInterval(() => {
      frame += 1;
      if (frame >= frames) {
        clearInterval(timerRef.current);
        setScrambled(text);
        return;
      }
      setScrambled(scrambleText(text, (text.length / frames) * frame));
    }, 42);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, text]);

  return (
    <Tag
      className={className}
      onMouseEnter={() => setSelf(true)}
      onMouseLeave={() => setSelf(false)}
      aria-label={ariaLabel || text}
    >
      {display}
    </Tag>
  );
}
