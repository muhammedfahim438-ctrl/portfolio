"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCode } from "react-icons/fi";
import {
  SiPython, SiReact, SiDjango, SiFlutter,
  SiPostgresql, SiDocker, SiGooglecloud, SiVercel,
} from "react-icons/si";
import { getCollection } from "@/lib/firestore";
import { resolveIcon } from "@/lib/iconMap";

const logos = [
  { icon: SiPython, name: "Python" },
  { icon: SiReact, name: "React" },
  { icon: SiDjango, name: "Django" },
  { icon: SiFlutter, name: "Flutter" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: SiDocker, name: "Docker" },
  { icon: SiGooglecloud, name: "AWS" },
  { icon: SiVercel, name: "Vercel" },
];

export function TrustedBySection() {
  const [brands, setBrands] = useState(logos);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCollection("trusted_by");
        if (mounted && Array.isArray(data) && data.length) setBrands(data);
      } catch {
        // static fallback
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-16 px-4 border-y border-themeBorder">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-themeText-secondary text-sm font-mono uppercase tracking-wider mb-8"
        >
          Technologies I Work With
        </motion.p>

        <div className="relative overflow-hidden">
          <div className="animate-logo-scroll inline-flex gap-12 items-center">
            {[...brands, ...brands].map((logo, i) => {
              const iconKey = logo.icon;
              const Icon = typeof iconKey === "string" ? resolveIcon(iconKey) : (iconKey || FiCode);
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 text-themeText-secondary/40 hover:text-themeAccent transition-colors duration-300 shrink-0"
                  data-cursor-hover
                >
                  <Icon aria-hidden="true" className="w-8 h-8" />
                  <span className="text-sm font-medium hidden md:inline">{logo.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
