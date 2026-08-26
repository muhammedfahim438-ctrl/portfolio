"use client";

import { motion } from "framer-motion";

interface Step {
  number: number;
  title: string;
  description: string;
  color: "accent" | "secondary";
}

const steps: Step[] = [
  {
    number: 1,
    title: "Data Collection",
    description: "Gathering raw data from Census XLS files, REST APIs, databases",
    color: "accent",
  },
  {
    number: 2,
    title: "Data Cleaning",
    description: "Resolving duplicates, inconsistent formats, foreign key mismatches",
    color: "secondary",
  },
  {
    number: 3,
    title: "Analysis & Modeling",
    description: "Financial metrics, ML models with Scikit-learn, SMOTE",
    color: "accent",
  },
  {
    number: 4,
    title: "Visualization & Deployment",
    description: "Power BI dashboards, Chart.js, Vercel deployment",
    color: "secondary",
  },
];

const getColor = (color: Step["color"]) =>
  color === "accent" ? "text-themeAccent border-themeAccent" : "text-themeSecondary border-themeSecondary";

const getBg = (color: Step["color"]) =>
  color === "accent" ? "bg-themeAccent" : "bg-themeSecondary";

export function WorkflowTimeline() {
  return (
    <section className="py-20 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-gradient"
      >
        Data Analysis Workflow
      </motion.h2>

      <div className="max-w-5xl mx-auto">
        {/* Desktop horizontal */}
        <div className="hidden md:flex items-start justify-between relative">
          <div className="absolute top-6 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-themeBorder" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center text-center w-1/4 relative z-10"
            >
              <div
                className={`w-12 h-12 rounded-full border-2 ${getColor(step.color)} bg-themeBg flex items-center justify-center text-lg font-display font-bold mb-4`}
              >
                {step.number}
              </div>
              <h3 className="font-display font-semibold text-themeText mb-2 text-sm md:text-base">
                {step.title}
              </h3>
              <p className="text-themeText-secondary text-xs md:text-sm leading-relaxed max-w-[180px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden flex flex-col gap-0 relative">
          <div className="absolute left-6 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-themeBorder" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex items-start gap-4 relative z-10 py-6"
            >
              <div
                className={`w-12 h-12 rounded-full border-2 ${getColor(step.color)} bg-themeBg flex items-center justify-center text-lg font-display font-bold shrink-0`}
              >
                {step.number}
              </div>
              <div className="pt-1">
                <h3 className="font-display font-semibold text-themeText mb-1">
                  {step.title}
                </h3>
                <p className="text-themeText-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
