"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiDownload } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import toast from "react-hot-toast";
import { sendMessage, getSocialData } from "@/lib/firestore";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_LOCATION,
  GITHUB_URL,
  LINKEDIN_URL,
  MESSAGE_LIMITS,
  EMAIL_REGEX,
  MIN_FORM_FILL_MS,
} from "@/lib/constants";
import { SplitText } from "@/components/ui/SplitText";

const REASONS = [
  "HIRE ME — PROJECT WORK",
  "PROJECT COLLABORATION",
  "SPEAKING / EVENT INVITATION",
  "JUST SAYING HELLO",
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function ContactFooter() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [social, setSocial] = useState({
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
    location: CONTACT_LOCATION,
    github: GITHUB_URL,
    linkedin: LINKEDIN_URL,
  });
  const formStartedAt = useRef(null);

  const markFormStart = () => {
    if (formStartedAt.current === null) formStartedAt.current = Date.now();
  };

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

    if (website.trim()) {
      toast.error("Failed to send message. Please try again.");
      return;
    }

    const filledFor =
      formStartedAt.current === null ? 0 : Date.now() - formStartedAt.current;
    if (filledFor < MIN_FORM_FILL_MS) {
      toast.error("Please take a moment before sending your message.");
      return;
    }

    const senderName = name.trim();
    const senderEmail = email.trim();
    const senderPhone = phone.trim();
    const messageBody = message.trim();

    if (!senderName || !senderEmail || !messageBody) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (senderName.length > MESSAGE_LIMITS.sender_name) {
      toast.error(`Name must be ${MESSAGE_LIMITS.sender_name} characters or fewer.`);
      return;
    }
    if (senderPhone.length > MESSAGE_LIMITS.sender_phone) {
      toast.error(`Phone must be ${MESSAGE_LIMITS.sender_phone} characters or fewer.`);
      return;
    }
    if (senderEmail.length > MESSAGE_LIMITS.sender_email) {
      toast.error(`Email must be ${MESSAGE_LIMITS.sender_email} characters or fewer.`);
      return;
    }
    if (!EMAIL_REGEX.test(senderEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (messageBody.length > MESSAGE_LIMITS.message_body) {
      toast.error(`Message must be ${MESSAGE_LIMITS.message_body} characters or fewer.`);
      return;
    }

    setLoading(true);
    try {
      await sendMessage({
        sender_name: senderName,
        sender_email: senderEmail,
        sender_phone: senderPhone,
        reason,
        message_body: messageBody,
      });
      setSent(true);
      setName("");
      setPhone("");
      setEmail("");
      setWebsite("");
      setReason(REASONS[0]);
      setMessage("");
      formStartedAt.current = null;
    } catch (err) {
      if (err?.code === "permission-denied") {
        toast.error("You have already sent a message today. Please try again tomorrow, or email me directly.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("contact-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (window.__lenis) {
      window.__lenis.scrollTo("#contact-form");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="contact" className="py-20 px-4 border-t border-themeBorder bg-themeBg overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-start max-w-4xl"
          >
            <div className="flex items-center gap-3 border-l-4 border-themeAccent pl-4 mb-4">
              <span className="text-themeAccent font-mono text-xs tracking-[0.3em] uppercase">
                Get In Touch
              </span>
            </div>

            <SplitText
              text="Let's Build Something"
              accentWord="Build"
              className="font-display font-black uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,6vw,3rem)] text-themeText"
            />

            <p className="text-themeText-secondary leading-relaxed text-base max-w-lg mt-4">
              I'm open to freelance work, contract roles, and full-time opportunities.
              Tell me about your idea and I'll get back within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-colors"
              >
                Start a Project
                <FiSend className="w-4 h-4 ml-1.5" />
              </button>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-none border-2 border-themeBorder bg-transparent text-themeText font-display font-semibold hover:border-themeAccent hover:text-themeAccent transition-colors"
              >
                Download Resume
                <FiDownload className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              id="contact-form"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="scroll-mt-24"
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-none p-10 border-2 border-themeBorder bg-themeSurface/30 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 border-2 border-themeAccent flex items-center justify-center text-themeAccent">
                    <FiSend className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-themeText text-xl mb-2 uppercase">
                    Message Sent
                  </h3>
                  <p className="text-themeText-secondary">
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 px-5 py-2 rounded-none border-2 border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} onFocus={markFormStart} onMouseDown={markFormStart} onTouchStart={markFormStart} className="relative space-y-6">
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <BrandInput label="FULL NAME" id="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                    <BrandInput label="PHONE" id="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999" />
                  </div>

                  <BrandInput label="EMAIL ADDRESS" id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                  <BrandInput label="WHAT BRINGS YOU HERE?" id="reason" type="select" value={reason} onChange={(e) => setReason(e.target.value)} required>
                    {REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </BrandInput>
                  <BrandInput label="MESSAGE" id="message" type="textarea" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Tell me about your project or idea..." required />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-none animate-spin" />
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
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col justify-between gap-8"
            >
              <div className="space-y-5 text-sm">
                <BrandContactItem icon={<FiMail className="w-4 h-4 shrink-0" />} label="EMAIL" value={social.email} href={`mailto:${social.email}`} />
                <BrandContactItem icon={<FiPhone className="w-4 h-4 shrink-0" />} label="PHONE" value={social.phone} />
                <BrandContactItem icon={<FiMapPin className="w-4 h-4 shrink-0" />} label="LOCATION" value={social.location} />
              </div>

              <div className="rounded-none p-8 border-2 border-themeBorder bg-themeSurface/20">
                <p className="font-display font-bold text-themeText text-base mb-4 uppercase">
                  Find Me On
                </p>
                <div className="flex flex-wrap gap-4">
                  <BrandSocial href={social.github} icon={<FaGithub className="w-4 h-4" />} label="GITHUB" />
                  <BrandSocial href={social.linkedin} icon={<FaLinkedin className="w-4 h-4" />} label="LINKEDIN" />
                  <BrandSocial href={`mailto:${social.email}`} icon={<FiMail className="w-4 h-4" />} label="EMAIL" />
                </div>
              </div>

              <div className="text-xs text-themeText-secondary/60 uppercase tracking-wider">
                Your information is private and will never be shared.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="mt-12 pt-10 border-t border-themeBorder">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6 pb-10">
          <nav className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="link-underline text-sm text-themeText-secondary hover:text-themeAccent transition-colors uppercase tracking-[0.1em]">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-themeText-secondary text-center md:text-left">
              <p>&copy; 2026 Muhammed Fahim M. All rights reserved.</p>
              <p className="mt-1 text-xs text-themeText-secondary/50 uppercase tracking-wider">
                Built with React, Firebase & Tailwind
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="GitHub">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href={`mailto:${social.email}`} className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="Email">
                <FiMail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function BrandInput({ label, id, type, value, onChange, placeholder, required, children }) {
  const isSelect = type === "select";
  const isTextarea = type === "textarea";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary/70">
        {label}{required && <span className="text-themeAccent">*</span>}
      </label>
      {isSelect ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-colors">
          {children}
        </select>
      ) : isTextarea ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={placeholder ? 1 : undefined} placeholder={placeholder} className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-colors resize-none" />
      ) : (
        <input id={id} type={type} autoComplete={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText placeholder-themeText-secondary/40 focus:outline-none focus:border-themeAccent transition-colors" />
      )}
    </div>
  );
}

function BrandContactItem({ icon, label, value, href }) {
  return (
    <a href={href} className="flex items-center gap-2 text-themeText-secondary hover:text-themeAccent transition-colors uppercase tracking-[0.1em] text-xs">
      {icon}
      <span>{value}</span>
    </a>
  );
}

function BrandSocial({ href, icon, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-none border-2 border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors uppercase tracking-[0.1em]">
      {icon}
      <span>{label}</span>
    </a>
  );
}
