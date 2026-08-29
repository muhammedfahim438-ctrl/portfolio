"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiCode, FiServer, FiDatabase, FiSmartphone } from "react-icons/fi";
import { getCollection } from "@/lib/firestore";

const DEFAULT_SERVICES = [
  {
    title: "Web Apps & Frontends",
    desc: "Fast, responsive, and accessible web applications with React, modern tooling, and pixel-perfect interfaces.",
    tags: ["React", "Vite", "Tailwind", "TypeScript"],
    icon: "FiCode",
  },
  {
    title: "APIs & Backend",
    desc: "Production-grade REST APIs and backend services with Django, authentication, and clean data modeling.",
    tags: ["Django", "REST", "PostgreSQL", "JWT"],
    icon: "FiServer",
  },
  {
    title: "Machine Learning & Data",
    desc: "Predictive models, data pipelines, and analytics dashboards that turn raw data into decisions.",
    tags: ["Python", "scikit-learn", "LSTM", "Power BI"],
    icon: "FiDatabase",
  },
  {
    title: "Mobile Apps",
    desc: "Cross-platform mobile apps with Flutter — from booking flows to AI-powered chat and wellness tools.",
    tags: ["Flutter", "Firebase", "Mobile"],
    icon: "FiSmartphone",
  },
];

const ICONS = { FiCode, FiServer, FiDatabase, FiSmartphone };

export function ServicesSection() {
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    let mounted = true;
    getCollection("services")
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length) setServices(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="services" className="py-24 px-5 sm:px-8 lg:px-14 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-5"
        >
          <p className="theme-eyebrow">What I do</p>
          <h2 className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl md:text-6xl">
            SERVICES I OFFER
          </h2>
          <p className="theme-lede text-themeText-secondary max-w-xl">
            From idea to production. I&apos;ll take your project from concept to a
            launched, scalable product.
          </p>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] ?? FiCode;
            return (
              <motion.a
                key={s.title ?? i}
                href="#contact"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="prem-card group flex flex-col p-6 cursor-pointer hover:border-themeAccent/40 transition-colors"
                data-cursor-hover
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-themeAccent/12 text-themeAccent border border-themeAccent/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-xl text-themeText">{s.title}</h3>
                <p className="mt-2 text-sm text-themeText-secondary leading-relaxed flex-1">{s.desc}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(s.tags ?? []).map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] font-mono uppercase bg-themeBg-secondary border border-themeBorder text-themeText-secondary rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-themeAccent opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  Start a project <FiArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
