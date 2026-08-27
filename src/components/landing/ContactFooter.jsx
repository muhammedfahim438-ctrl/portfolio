"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiSend, FiArrowUp } from "react-icons/fi";
import toast from "react-hot-toast";
import { sendMessage, getSocialData } from "@/lib/firestore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ScenicScene } from "@/components/landing/ScenicScene";

const MARQUEE_ITEMS = [
  "Data Science",
  "Full-Stack Development",
  "Machine Learning",
  "REST APIs",
  "Python",
  "Django",
  "React.js",
  "Flutter",
  "PostgreSQL",
  "Power BI",
];

const REASONS = [
  "Hire Me — Project Work",
  "Project Collaboration",
  "Speaking / Event Invitation",
  "Just Saying Hello",
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function ContactFooter() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [social, setSocial] = useState({
    email: "muhammedfahim438@gmail.com",
    phone: "+91 9061635562",
    location: "Palakkad, Kerala, India",
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getSocialData();
        if (!mounted || !data) return;
        setSocial((prev) => ({
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          location: data.location || prev.location,
          github: data.github || prev.github,
          linkedin: data.linkedin || prev.linkedin,
        }));
      } catch {
        // keep fallback values
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await sendMessage({
        sender_name: name.trim(),
        sender_email: email.trim(),
        sender_phone: phone.trim(),
        reason,
        message_body: message.trim(),
      });
      setSent(true);
      setName("");
      setPhone("");
      setEmail("");
      setReason(REASONS[0]);
      setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="py-12 border-t border-themeBorder overflow-hidden">
        <div className="relative whitespace-nowrap">
          <div className="animate-marquee inline-flex gap-8">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="text-5xl md:text-7xl font-display font-bold text-themeBorder/30 select-none"
              >
                {item}
                <span className="mx-8 text-themeAccent/30">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden">
        <ScenicScene variant="footer" />

        <div className="relative z-10">
          <section id="contact" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <p className="theme-eyebrow mb-4">Get in Touch</p>
            <h2 className="theme-display">
              Let&apos;s build something{" "}
              <em>together.</em>
            </h2>
            <p className="text-themeText-secondary mt-5 leading-relaxed max-w-2xl">
              Fill in the form below and I&apos;ll get back to you within 24
              hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-10 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-themeAccent/15 flex items-center justify-center">
                    <FiSend className="w-6 h-6 text-themeAccent" />
                  </div>
                  <h3 className="font-display font-semibold text-themeText text-2xl mb-2">
                    Message sent!
                  </h3>
                  <p className="text-themeText-secondary">
                    Thanks for reaching out. I&apos;ll get back to you within
                    24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 px-5 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-themeText-secondary mb-1.5">
                        Full Name <span className="text-themeAccent">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-themeInput border border-themeBorder text-themeText placeholder-themeText-secondary/40 focus:outline-none focus:border-themeAccent transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-themeText-secondary mb-1.5">
                        Phone <span className="text-themeText/40">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-themeInput border border-themeBorder text-themeText placeholder-themeText-secondary/40 focus:outline-none focus:border-themeAccent transition-colors"
                        placeholder="+91 99999 99999"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-themeText-secondary mb-1.5">
                      Email Address <span className="text-themeAccent">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-themeInput border border-themeBorder text-themeText placeholder-themeText-secondary/40 focus:outline-none focus:border-themeAccent transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-themeText-secondary mb-1.5">
                      What brings you here? <span className="text-themeAccent">*</span>
                    </label>
                    <select
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-themeInput border border-themeBorder text-themeText focus:outline-none focus:border-themeAccent transition-colors"
                    >
                      {REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-themeText-secondary mb-1.5">
                      Message <span className="text-themeAccent">*</span>
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-themeInput border border-themeBorder text-themeText placeholder-themeText-secondary/40 focus:outline-none focus:border-themeAccent transition-colors resize-none"
                      placeholder="Tell me about your project or idea..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-themeAccent to-themeSecondary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-between gap-8"
            >
              <div className="space-y-4 text-sm">
                <a
                  href={`mailto:${social.email}`}
                  className="flex items-center gap-3 text-themeText-secondary hover:text-themeAccent transition-colors"
                >
                  <FiMail className="w-4 h-4 shrink-0" />
                  {social.email}
                </a>
                <p className="flex items-center gap-3 text-themeText-secondary">
                  <FiPhone className="w-4 h-4 shrink-0" />
                  {social.phone}
                </p>
                <p className="flex items-center gap-3 text-themeText-secondary">
                  <FiMapPin className="w-4 h-4 shrink-0" />
                  {social.location}
                </p>
              </div>

              <div className="glass rounded-2xl p-8">
                <p className="font-display font-semibold text-themeText text-lg mb-6">
                  Find me on
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                  >
                    <FaGithub className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                  >
                    <FaLinkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:${social.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                  >
                    <FiMail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>

              <div className="text-sm text-themeText-secondary/70">
                Your information is private and will never be shared.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="mt-8 pt-8 border-t border-themeBorder">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-8 pb-8">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-themeText-secondary hover:text-themeAccent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-themeText-secondary text-center md:text-left">
              <p>&copy; 2026 Muhammed Fahim M. All rights reserved.</p>
              <p className="mt-1 text-themeText-secondary/60">
                Built with React, Firebase &amp; Tailwind
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-themeText-secondary hover:text-themeAccent transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-themeText-secondary hover:text-themeAccent transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${social.email}`}
                className="text-themeText-secondary hover:text-themeAccent transition-colors"
                aria-label="Email"
              >
                <FiMail className="w-5 h-5" />
              </a>
              <button
                onClick={() => {
                  if (window.__lenis) window.__lenis.scrollTo(0);
                  else window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-themeBorder text-themeText-secondary hover:border-themeAccent hover:text-themeAccent transition-colors"
                aria-label="Go to top"
              >
                <FiArrowUp className="w-4 h-4" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
        </footer>
        </div>
      </div>
    </>
  );
}