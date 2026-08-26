"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import type { TerminalLine } from "@/types";

const COMMANDS: Record<string, () => TerminalLine[]> = {
  help: () => [
    { text: "Available commands:", type: "output" },
    { text: "  help          - Show this help message", type: "output" },
    { text: "  whoami        - About me", type: "output" },
    { text: "  skills        - Technical skills", type: "output" },
    { text: "  projects      - Featured projects", type: "output" },
    { text: "  experience    - Work experience", type: "output" },
    { text: "  contact       - Contact info", type: "output" },
    { text: "  github        - GitHub profile", type: "output" },
    { text: "  cert          - Certifications", type: "output" },
    { text: "  history       - Command history", type: "output" },
    { text: "  clear         - Clear terminal", type: "output" },
    { text: "  matrix        - ???? Easter Egg", type: "output" },
    { text: "  ls -la        - ???? Easter Egg", type: "output" },
    { text: "  sudo hire me  - ???? Easter Egg", type: "output" },
  ],
  whoami: () => [
    { text: "MUHAMMED FAHIM M", type: "ascii" },
    { text: "Data Science & Full-Stack Developer", type: "output" },
    { text: "Palakkad, Kerala, India", type: "output" },
  ],
  skills: () => [
    { text: "Technical Skills:", type: "output" },
    { text: "  Languages    : Python, JavaScript, SQL, Dart", type: "output" },
    { text: "  Backend      : Django, DRF, FastAPI, Flask, REST APIs", type: "output" },
    { text: "  Frontend     : React.js, Next.js, Flutter, HTML5/CSS3", type: "output" },
    { text: "  AI/ML        : Scikit-learn, Pandas, NumPy, SMOTE", type: "output" },
    { text: "  Databases    : PostgreSQL, MySQL, MongoDB, SQLite/NeonDB", type: "output" },
    { text: "  Data Analysis: Pandas, Power BI, Chart.js", type: "output" },
    { text: "  Tools        : JWT, Razorpay, AWS, Docker, Git, Vercel, Redis", type: "output" },
  ],
  projects: () => [
    { text: "Featured Projects:", type: "output" },
    { text: "  1. India Geo API     - SaaS REST API serving 619,000+ villages", type: "output" },
    { text: "  2. VitaSense AI      - 98.2% accuracy diabetes prediction", type: "output" },
    { text: "  3. UniPath            - College counselling & wellness mobile app", type: "output" },
    { text: "  + 9 more on GitHub", type: "output" },
  ],
  experience: () => [
    { text: "Work Experience:", type: "output" },
    { text: "  Full Stack Dev Intern - TechFifo (Apr-Jun 2026)", type: "output" },
    { text: "  Data Analyst Intern  - Bluestock Fintech (Apr-Jun 2026)", type: "output" },
  ],
  contact: () => [
    { text: "Contact Information:", type: "output" },
    { text: "  Email   : muhammedfahim438@gmail.com", type: "output" },
    { text: "  Phone   : +91 98959 35274", type: "output" },
    { text: "  GitHub  : muhammedfahim438-ctrl", type: "output" },
    { text: "  LinkedIn: muhammed-fahim-m", type: "output" },
  ],
  github: () => [
    { text: "GitHub Profile:", type: "output" },
    { text: "  github.com/muhammedfahim438-ctrl", type: "output" },
    { text: "  13 public repos | 3 followers", type: "output" },
  ],
  cert: () => [
    { text: "Certifications:", type: "output" },
    { text: "  - Infosys Springboard - Programming Fundamentals (2026)", type: "output" },
    { text: "  - n8n - Workflow Automation (2026)", type: "output" },
    { text: "  - Linguaskill - Cambridge (2026)", type: "output" },
  ],
  clear: () => [],
  history: () => [],
  "sudo hire me": () => [
    { text: "", type: "output" },
    { text: " Y88888P  dP         dP   dP          dP              ", type: "easter-egg" },
    { text: "   88    88         88   88          88              ", type: "easter-egg" },
    { text: "   88    88d88d88b  88d888P  .d8888b. 88d888b.  .d8888b.", type: "easter-egg" },
    { text: "   88    88    88   88  88    88    ' 88    '  Y8ooooo.", type: "easter-egg" },
    { text: "   88    88    88   88  88    88.  .8 88.  .8       .88", type: "easter-egg" },
    { text: "   dP    dP    dP   dP  dP    '88888P' 88Y888P  '88888P'", type: "easter-egg" },
    { text: "", type: "output" },
    { text: "  Welcome to the team, Fahim! You're HIRED! \u{1F389}", type: "easter-egg" },
    { text: "", type: "output" },
  ],
  matrix: () => {
    const lines: TerminalLine[] = [];
    const chars = "01";
    for (let i = 0; i < 12; i++) {
      let line = "";
      for (let j = 0; j < 60; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      lines.push({ text: line, type: "easter-egg" });
    }
    return lines;
  },
  "ls -la": () => [
    { text: "total 42", type: "output" },
    { text: "drwxr-xr-x  1 fahim  staff   4096 Jun 15 09:30 .", type: "output" },
    { text: "drwxr-xr-x  1 fahim  staff   4096 Jun 15 09:30 ..", type: "output" },
    { text: "-rw-r--r--  1 fahim  staff   1024 Jun 15 09:30 .motivation", type: "output" },
    { text: "-rw-r--r--  1 fahim  staff   2048 Jun 15 09:30 .coffee", type: "output" },
    { text: "-rw-r--r--  1 fahim  staff   4096 Jun 15 09:30 .dreams", type: "output" },
    { text: "-rw-r--r--  1 fahim  staff    512 Jun 15 09:30 .imposter-syndrome", type: "output" },
    { text: "-rw-r--r--  1 fahim  staff   8192 Jun 15 09:30 README.md", type: "output" },
    { text: "-rw-r--r--  1 fahim  staff   3072 Jun 15 09:30 skills.json", type: "output" },
    { text: "-rw-r--r--  1 fahim  staff  16384 Jun 15 09:30 projects.tar.gz", type: "output" },
    { text: "-rwxr-xr-x  1 fahim  staff   1024 Jun 15 09:30 deploy.sh", type: "output" },
    { text: "-rw-r--r--  1 fahim  staff    256 Jun 15 09:30 .env.local", type: "output" },
  ],
};

function processCommand(input: string): TerminalLine[] {
  const cmd = input.trim().toLowerCase();
  if (cmd === "clear") return [];
  if (cmd === "history") return [];
  if (COMMANDS[cmd]) return COMMANDS[cmd]();
  return [{ text: `command not found: ${cmd}. Type "help" for available commands.`, type: "error" }];
}

export function TerminalWidget() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'Welcome to Fahim\'s portfolio terminal. Type "help" to get started.', type: "output" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const inputLine: TerminalLine = { text: input, type: "input" };
    const output = processCommand(input);

    if (input.trim().toLowerCase() === "clear") {
      setLines([]);
      setInput("");
      setHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      return;
    }

    if (input.trim().toLowerCase() === "history") {
      const historyLines: TerminalLine[] = history.map(
        (cmd, i) => ({ text: `  ${i + 1}  ${cmd}`, type: "output" as const })
      );
      setLines((prev) => [...prev, inputLine, ...historyLines]);
      setInput("");
      setHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      return;
    }

    setLines((prev) => [...prev, inputLine, ...output]);
    setHistory((prev) => [...prev, input]);
    setInput("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "text-themeText";
      case "error":
        return "text-themeSecondary";
      case "ascii":
      case "easter-egg":
        return "text-themeAccent";
      default:
        return "text-themeText-secondary";
    }
  };

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto glass rounded-2xl overflow-hidden"
        style={{ maxWidth: 700 }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-themeBorder">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
          <span className="ml-2 text-xs text-themeText-secondary font-mono">fahim@portfolio:~</span>
        </div>

        <div
          ref={scrollRef}
          className="font-mono text-sm p-4 overflow-y-auto"
          style={{ maxHeight: 400, minHeight: 200 }}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i} className={`whitespace-pre-wrap ${getLineColor(line.type)}`}>
              {line.type === "input" && (
                <span className="text-themeAccent">fahim@portfolio:~$ </span>
              )}
              {line.text}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center mt-1">
            <span className="text-themeAccent mr-2 whitespace-nowrap">fahim@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-themeText font-mono"
              autoFocus
              spellCheck={false}
            />
            <span className="cursor-blink w-[8px] h-[15px] bg-themeAccent inline-block ml-0.5" />
          </form>
        </div>
      </motion.div>
    </section>
  );
}
