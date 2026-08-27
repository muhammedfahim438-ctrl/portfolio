"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";
import { WordHighlight } from "@/components/ui/WordHighlight";

const stats = [
  { label: "Years Experience", value: 2, suffix: "+" },
  { label: "Projects Built", value: 12, suffix: "+" },
  { label: "GitHub Repos", value: 13, suffix: "" },
  { label: "Technologies", value: 30, suffix: "+" },
];

function CountUp({ target, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="text-4xl md:text-5xl font-display font-bold text-gradient">
      {count}{suffix}
    </span>
  );
}

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-themeAccent font-mono text-sm tracking-wider uppercase mb-3">
            About Me
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            <SplitText as="span" text="Building the Future with Data" accentWord="Data" />
          </h2>
          <div className="max-w-3xl space-y-4 text-themeText-secondary leading-relaxed">
            <WordHighlight text="I'm a Data Science and Full-Stack Developer from Kerala, India, passionate about building production-grade APIs, ML models, and scalable web applications. Currently pursuing my BSc in Data Science at Nehru Arts and Science College with a CGPA of 8.17." />
            <WordHighlight text="From parsing 619,000+ villages into a SaaS API to achieving 98.2% accuracy in diabetes prediction, I thrive at the intersection of data engineering, machine learning, and full-stack development. I believe in clean code, meaningful data, and products that solve real problems." />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
              <p className="text-themeText-secondary text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
