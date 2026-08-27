"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function CTASection() {
  return (
    <section className="py-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="theme-eyebrow mb-5">Let&apos;s Connect</p>
          <h2 className="theme-display mb-6">
            Let&apos;s build something{" "}
            <em>together.</em>
          </h2>
          <p className="text-themeText-secondary text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Meaningful work is never built in isolation. Looking for a builder,
            collaborator, or someone to turn ideas into shipped products?
            Let&apos;s start the conversation.
          </p>

          <MagneticButton className="inline-flex px-9 py-4 rounded-xl bg-gradient-to-r from-themeAccent to-themeSecondary text-white font-semibold text-lg hover:opacity-90 transition-opacity">
            <a href="#contact" className="flex items-center gap-2">
              Let&apos;s Connect
              <FiArrowUpRight className="w-5 h-5" />
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}