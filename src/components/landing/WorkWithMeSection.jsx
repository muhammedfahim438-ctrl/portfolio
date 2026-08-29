"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiMail } from "react-icons/fi";
import { getCollection, getSocialData, getConfig } from "@/lib/firestore";
import { MagneticButton } from "@/components/ui/MagneticButton";

const DEFAULT_STEPS = [
  { step: "01", title: "Discover", desc: "We align on your goals, scope, and success metrics." },
  { step: "02", title: "Design", desc: "I map the architecture, UX, and data model." },
  { step: "03", title: "Build", desc: "Rapid, tested, production-grade development." },
  { step: "04", title: "Launch & Support", desc: "Deploy, monitor, and iterate post-launch." },
];

export function WorkWithMeSection() {
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [email, setEmail] = useState("muhammedfahim438@gmail.com");
  const [availability, setAvailability] = useState({
    available: true,
    label: "Currently available for new projects",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [stepData, social, avail] = await Promise.all([
          getCollection("work_steps"),
          getSocialData(),
          getConfig("availability_data", null),
        ]);
        if (!mounted) return;
        if (Array.isArray(stepData) && stepData.length) setSteps(stepData);
        if (social?.email) setEmail(social.email);
        if (avail) {
          setAvailability({
            available: avail.available !== false,
            label: avail.label || availability.label,
          });
        }
      } catch {
        // keep defaults
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="work-with" className="py-24 px-5 sm:px-8 lg:px-14 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-5"
        >
          <p className="theme-eyebrow">How we work</p>
          <h2 className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl md:text-6xl">
            FROM IDEA TO LAUNCH
          </h2>
          <p className="theme-lede text-themeText-secondary max-w-xl">
            A clear, collaborative process so you always know where your project stands.
          </p>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.title ?? i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="relative border-l border-themeBorder pl-6"
            >
              <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-themeAccent" />
              <span className="font-mono text-sm text-themeAccent">{s.step}</span>
              <h3 className="mt-2 font-display font-semibold text-xl text-themeText">{s.title}</h3>
              <p className="mt-2 text-sm text-themeText-secondary leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Hire CTA band */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="prem-card mt-16 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-themeAccent/12 via-transparent to-themeSecondary/15 pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-8 md:p-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-themeBorder bg-themeSurface/70 px-4 py-1.5 mb-4">
                <span className="avail-dot" />
                <span className="font-mono text-xs tracking-wide text-themeText-secondary">
                  {availability.available ? availability.label : "Currently booked"}
                </span>
              </div>
              <h3 className="font-display font-bold text-3xl md:text-5xl leading-tight">
                Have a project in mind? <span className="emb-text">Let&apos;s build it.</span>
              </h3>
              <p className="mt-4 text-themeText-secondary">
                I&apos;m open to freelance work, contract roles, and full-time opportunities.
                Tell me about your idea and I&apos;ll get back within 24 hours.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <MagneticButton>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-themeAccent to-themeSecondary px-7 py-4 font-display font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
                >
                  Hire Me
                  <FiArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </MagneticButton>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-themeBorder px-7 py-4 text-themeText-secondary hover:border-themeAccent hover:text-themeAccent transition-colors"
              >
                <FiMail className="w-4 h-4" />
                {email}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
