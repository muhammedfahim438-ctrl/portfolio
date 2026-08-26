"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import { sendMessage } from "@/lib/firestore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function ContactFooter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await sendMessage({
        sender_name: name.trim(),
        sender_email: email.trim(),
        message_body: message.trim(),
      });
      toast.success("Message sent! I'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gradient">
              Get In Touch
            </h2>
            <p className="text-themeText-secondary mb-8 leading-relaxed">
              Have a project in mind or want to collaborate? Send me a message
              and I&apos;ll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-themeText-secondary mb-1.5">
                  Name
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
                <label htmlFor="email" className="block text-sm font-medium text-themeText-secondary mb-1.5">
                  Email
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
                <label htmlFor="message" className="block text-sm font-medium text-themeText-secondary mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-themeInput border border-themeBorder text-themeText placeholder-themeText-secondary/40 focus:outline-none focus:border-themeAccent transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-themeAccent to-themeSecondary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold text-themeText text-lg">
                  Contact Info
                </h3>
                <div className="space-y-3 text-sm">
                  <a
                    href="mailto:muhammedfahim438@gmail.com"
                    className="flex items-center gap-3 text-themeText-secondary hover:text-themeAccent transition-colors"
                  >
                    <FiMail className="w-4 h-4 shrink-0" />
                    muhammedfahim438@gmail.com
                  </a>
                  <p className="flex items-center gap-3 text-themeText-secondary">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +91 98959 35274
                  </p>
                  <p className="flex items-center gap-3 text-themeText-secondary">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Palakkad, Kerala, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="mt-20 pt-8 border-t border-themeBorder">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pb-8">
          <div className="text-sm text-themeText-secondary text-center md:text-left">
            <p>&copy; 2026 Muhammed Fahim M. All rights reserved.</p>
            <p className="mt-1 text-themeText-secondary/60">
              Built with Next.js, Firebase &amp; Tailwind
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/muhammedfahim438-ctrl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-themeText-secondary hover:text-themeAccent transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/muhammed-fahim-m"
              target="_blank"
              rel="noopener noreferrer"
              className="text-themeText-secondary hover:text-themeAccent transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </section>
  );
}
