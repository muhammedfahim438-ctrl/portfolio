"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiStar, FiGitBranch } from "react-icons/fi";
import { SplitText } from "@/components/ui/SplitText";
import { getCollection } from "@/lib/firestore";

const USER = "muhammedfahim438-ctrl";

const REPOS = [
  { name: "geo-api", blurb: "SaaS REST API — 619K+ villages, Redis, JWT, Razorpay", lang: "TypeScript" },
  { name: "VitaSense-AI-v2", blurb: "98.2% acc diabetes prediction — ensemble ML + Flask", lang: "Python" },
  { name: "unipath", blurb: "College counselling & wellness — Flutter + Firebase", lang: "Dart" },
  { name: "nifty100-platform", blurb: "Nifty 100 financial intelligence — ETL + Django + Power BI", lang: "Python" },
  { name: "bluestock-mf-platform", blurb: "Mutual fund analytics — Python ETL + Power BI dashboards", lang: "Python" },
  { name: "NASC-grievance-portal", blurb: "Cross-platform grievance portal — Flutter + analytics", lang: "Dart" },
];

export function OpenSourceSection() {
  const [meta, setMeta] = useState({});
  const [repos, setRepos] = useState(REPOS);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCollection("open_source");
        if (mounted && Array.isArray(data) && data.length) setRepos(data);
      } catch {
        // static fallback
      }
    })();
    const src = repos;
    (async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`);
        if (!res.ok) throw new Error("github");
        const json = await res.json();
        const map = {};
        for (const name of src.map((r) => r.name)) {
          const repo = json.find((r) => (r.name || '').toLowerCase() === name.toLowerCase());
          if (repo) {
            map[name] = { stars: repo.stargazers_count ?? 0, forks: repo.forks_count ?? 0, lang: repo.language || undefined };
          }
        }
        if (mounted) setMeta(map);
      } catch {
        // graceful — render static only
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="opensource" className="relative py-24 px-4 sm:px-8 lg:px-14 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-5"
        >
          <p className="theme-eyebrow">$ ls ~/github</p>
          <SplitText
            text="OPEN SOURCE"
            accentWord="SOURCE"
            className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl md:text-6xl"
          />
          <p className="theme-lede text-themeText-secondary">
            13+ public repositories — production APIs, ML platforms, and
            cross-platform apps, documented and ready to fork.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {repos.map((repo) => {
            const m = meta[repo.name];
            const lang = m?.lang || repo.lang;
            return (
              <motion.a
                key={repo.name}
                href={`https://github.com/${USER}/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ y: -4 }}
                data-cursor-hover
                className="term-win group block p-6"
              >
                <div className="term-win__bar mb-4 -mx-6 -mt-6 px-6">
                  <span className="term-win__dot term-win__dot--red" />
                  <span className="term-win__dot term-win__dot--yellow" />
                  <span className="term-win__dot term-win__dot--green" />
                  <span className="ml-2 flex-1 truncate font-mono text-[11px] text-themeText-secondary">
                    {repo.name}.md
                  </span>
                  <FiGithub className="h-4 w-4 text-themeText-secondary" />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-mono text-base font-semibold text-themeText group-hover:text-themeAccent transition-colors">
                    <span className="text-themeAccent" aria-hidden>$</span> {repo.name}
                  </h3>
                  {lang && (
                    <span className="rounded-full border border-themeBorder px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-themeText-secondary">
                      {lang}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-themeText-secondary">
                  {repo.blurb}
                </p>

                <div className="mt-5 flex items-center gap-5 font-mono text-xs text-themeText-secondary">
                  <span className="flex items-center gap-1.5">
                    <FiStar className="h-4 w-4" />
                    {m?.stars ?? 0}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiGitBranch className="h-4 w-4" />
                    {m?.forks ?? 0}
                  </span>
                  <span className="ml-auto text-themeAccent transition-transform duration-300 group-hover:translate-x-1">
                    clone ↗
                  </span>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href={`https://github.com/${USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-themeBorder px-8 py-4 font-display font-semibold text-themeText hover:border-themeAccent hover:text-themeAccent transition-colors"
            data-cursor-hover
          >
            <FiGithub className="h-5 w-5" />
            View all on GitHub
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
