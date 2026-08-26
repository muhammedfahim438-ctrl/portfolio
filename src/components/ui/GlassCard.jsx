"use client";

import { motion } from "framer-motion";

export function GlassCard({ children, className = "", onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-2xl p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
