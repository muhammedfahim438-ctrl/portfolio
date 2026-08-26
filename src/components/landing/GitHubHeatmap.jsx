"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function generatePlaceholderData() {
  const data = [];
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const rand = Math.random();
    let count = 0;
    if (rand > 0.85) count = 4;
    else if (rand > 0.7) count = 3;
    else if (rand > 0.5) count = 2;
    else if (rand > 0.35) count = 1;
    data.push({ date: dateStr, count });
  }
  return data;
}

function getColor(level) {
  switch (level) {
    case 0: return "bg-themeHeatmap0";
    case 1: return "bg-themeHeatmap1";
    case 2: return "bg-themeHeatmap2";
    case 3: return "bg-themeHeatmap3";
    case 4: return "bg-themeHeatmap4";
    default: return "bg-themeHeatmap0";
  }
}

export function GitHubHeatmap() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://api.github.com/users/muhammedfahim438-ctrl/events?per_page=100",
          { headers: { Accept: "application/vnd.github.v3+json" } }
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const events = await res.json();

        const contributionTypes = [
          "PushEvent", "CreateEvent", "IssuesEvent", "PullRequestEvent",
          "PullRequestReviewEvent", "ReleaseEvent", "ForkEvent",
        ];

        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const contributions = {};
        for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
          contributions[d.toISOString().split("T")[0]] = 0;
        }

        events
          .filter((e) => contributionTypes.includes(e.type))
          .forEach((event) => {
            const date = event.created_at.split("T")[0];
            if (contributions[date] !== undefined) contributions[date]++;
          });

        const result = Object.entries(contributions).map(([date, count]) => ({
          date,
          count: Math.min(count, 4),
        }));

        setData(result);
        setTotal(result.reduce((s, d) => s + d.count, 0));
      } catch {
        const placeholder = generatePlaceholderData();
        setData(placeholder);
        setTotal(placeholder.reduce((s, d) => s + d.count, 0));
      }
    }
    fetchData();
  }, []);

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const handleMouse = (
    e,
    date,
    count
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 32,
      date,
      count,
    });
  };

  return (
    <section className="py-20 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-gradient"
      >
        GitHub Activity
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-themeText-secondary mb-8 text-sm"
      >
        {total.toLocaleString()} contributions in the last year
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto overflow-x-auto pb-2"
      >
        <div
          ref={containerRef}
          className="relative inline-flex gap-[3px] mx-auto"
          onMouseLeave={() => setTooltip(null)}
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-[11px] h-[11px] rounded-sm ${getColor(day.count)} cursor-pointer hover:ring-1 hover:ring-themeText/30 transition-all`}
                  onMouseEnter={(e) => handleMouse(e, day.date, day.count)}
                />
              ))}
            </div>
          ))}

          {tooltip && (
            <div
              className="absolute z-20 pointer-events-none px-2.5 py-1.5 rounded-md bg-themeBg-secondary border border-themeBorder text-xs text-themeText shadow-lg whitespace-nowrap"
              style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
            >
              <strong>{tooltip.count} contributions</strong> on {tooltip.date}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-themeText-secondary">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-[11px] h-[11px] rounded-sm ${getColor(level)}`}
            />
          ))}
          <span>More</span>
        </div>
      </motion.div>
    </section>
  );
}
