"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-12 md:p-16"
        >
          <p className="text-themeAccent font-mono text-sm tracking-wider uppercase mb-4">
            Let&apos;s Connect
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-themeText mb-6">
            Ready to Build Something{" "}
            <span className="text-gradient">Amazing</span>?
          </h2>
          <p className="text-themeText-secondary text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton className="px-8 py-4 rounded-xl bg-gradient-to-r from-themeAccent to-themeSecondary text-white font-semibold text-lg hover:opacity-90 transition-opacity">
              <a href="#contact" className="flex items-center gap-2">
                Start a Conversation
                <FiArrowRight className="w-5 h-5" />
              </a>
            </MagneticButton>
            <a
              href="mailto:muhammedfahim438@gmail.com"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-themeBorder text-themeText-secondary font-semibold text-lg hover:border-themeAccent hover:text-themeAccent transition-colors"
            >
              Send an Email
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
