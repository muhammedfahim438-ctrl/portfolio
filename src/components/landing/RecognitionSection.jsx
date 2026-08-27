"use client";

import { motion } from "framer-motion";
import { FiAward, FiStar, FiTrendingUp, FiZap } from "react-icons/fi";

const recognitions = [
  {
    title: "Top Contributor",
    description: "Recognized for building a SaaS API serving 619,000+ villages with production-grade architecture",
    icon: FiAward,
    color: "from-themeAccent to-themeSecondary",
  },
  {
    title: "ML Excellence",
    description: "Achieved 98.2% accuracy (ROC-AUC 0.9975) in diabetes prediction using ensemble models",
    icon: FiTrendingUp,
    color: "from-themeSecondary to-themeAccent",
  },
  {
    title: "Hackathon Winner",
    description: "Built UniPath — a cross-platform Flutter app for college counselling & wellness",
    icon: FiZap,
    color: "from-themeAccent to-themeSecondary",
  },
  {
    title: "Open Source Advocate",
    description: "13+ public repositories on GitHub with production-grade projects and documentation",
    icon: FiStar,
    color: "from-themeSecondary to-themeAccent",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function RecognitionSection() {
  return (
    <section id="recognition" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-themeAccent font-mono text-sm tracking-wider uppercase mb-3">
            Achievements
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient">
            Recognition
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {recognitions.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 flex gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-themeText text-lg mb-1">
                    {item.title}
                  </h3>
                  <p className="text-themeText-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
