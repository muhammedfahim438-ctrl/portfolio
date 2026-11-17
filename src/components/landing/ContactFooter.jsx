"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiDownload } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import toast from "react-hot-toast";
import { sendMessage, getSocialData } from "@/lib/firestore";
import { useBrandContent } from "@/hooks/useBrandContent";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";
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

const REASONS = [
  "Project work",
  "Collaboration",
  "Speaking or event invitation",
  "Just saying hello",
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function ContactFooter() {
  const { sections, footer } = useBrandContent();
  const copy = sections.contact || {};
  const navLinks =
    Array.isArray(footer.nav) && footer.nav.length > 0 ? footer.nav : NAV_LINKS;

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
    resume: "/resume.pdf",
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
          resume: data.resume_pdf_url || prev.resume,
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
    if (window.__lenis) {
      window.__lenis.scrollTo("#contact-form", { offset: -96 });
      return;
    }
    const el = document.getElementById("contact-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section id="contact" className="dg-screen relative overflow-hidden border-t border-themeBorder/40 py-24 px-4">
        {/* Ambient parallax glow over the dot HUD */}
        <div className="absolute inset-0" aria-hidden="true">
          <ParallaxLayers className="h-full w-full">
            <div className="absolute inset-0">
              <div className="absolute -left-24 top-1/3 h-80 w-80 bg-themeAccent/10 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-64 w-64 bg-themeSecondary/15 blur-3xl" />
            </div>
          </ParallaxLayers>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-20 text-start max-w-4xl"
          >
            <div className="flex items-center gap-3 border-l-2 border-themeAccent pl-4 mb-6 dg-corner">
              <span className="text-themeAccent font-mono text-xs tracking-[0.3em] uppercase dg-ui-mono">
                {copy.label}
              </span>
            </div>

            <h2 className="h2 dg-f-display text-themeText dg-glitch dg-corner dg-corner--signal" data-text={copy.heading}>
              {copy.heading}
            </h2>

            <p className="dg-f-subhead text-themeTextSecondary leading-relaxed text-lg max-w-xl mt-6">
              {copy.subhead}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
              <button
                onClick={scrollToForm}
                className="btn btn--primary dg-border-neon-red"
              >
                {copy.ctaLabel} <FiSend className="w-4 h-4 ml-1.5" />
              </button>
              <a
                href={social.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary dg-border-neon-signal"
              >
                {copy.ctaSecondaryLabel} <FiDownload className="w-4 h-4 ml-1.5" />
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
                  className="dg-r-0 p-10 border-2 border-themeBorder/60 bg-themeSurface/30 text-center dg-glass dg-sheen dg-border-hairline"
                >
                  <div className="w-12 h-12 mx-auto mb-4 border-2 border-themeAccent flex items-center justify-center text-themeAccent">
                    <FiSend className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-themeText text-xl mb-2">
                    {copy.successTitle}
                  </h3>
                  <p className="dg-f-subhead text-themeTextSecondary">
                    {copy.successBody}
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 px-6 py-2.5 rounded-none border-2 border-themeBorder text-themeTextSecondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors dg-ui-mono"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} onFocus={markFormStart} onMouseDown={markFormStart} onTouchStart={markFormStart} className="relative space-y-8">
                  <div
                    aria-hidden="true"
                    className="absolute -left-full top-auto h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <BrandInput id="name" label="Name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                    <BrandInput id="phone" label="Phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999" />
                  </div>

                  <BrandInput id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                  <BrandInput id="reason" label="Reason" type="select" value={reason} onChange={(e) => setReason(e.target.value)} required>
                    {REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </BrandInput>
                  <BrandInput id="message" label="Message" type="textarea" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Tell me about your project or idea..." required />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full btn btn--primary dg-border-neon-red"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-themeText/30 border-t-themeAccent rounded-full animate-spin" />
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
              <div className="space-y-6 text-sm">
                <BrandContactItem icon={<FiMail className="w-4 h-4 shrink-0" />} label="EMAIL" value={social.email} href={`mailto:${social.email}`} />
                <BrandContactItem icon={<FiPhone className="w-4 h-4 shrink-0" />} label="PHONE" value={social.phone} />
                <BrandContactItem icon={<FiMapPin className="w-4 h-4 shrink-0" />} label="LOCATION" value={social.location} />
              </div>

              <div className="dg-r-0 p-8 border-2 border-themeBorder/60 bg-themeSurface/20 dg-glass dg-sheen dg-border-hairline">
                <p className="font-display font-bold text-themeText text-base mb-4 dg-f-subhead">
                  Find me on
                </p>
                <div className="flex flex-wrap gap-4">
                  <BrandSocial href={social.github} icon={<FaGithub className="w-4 h-4" />} label="GITHUB" />
                  <BrandSocial href={social.linkedin} icon={<FaLinkedin className="w-4 h-4" />} label="LINKEDIN" />
                  <BrandSocial href={`mailto:${social.email}`} icon={<FiMail className="w-4 h-4" />} label="EMAIL" />
                </div>
              </div>

              <div className="text-xs text-themeTextSecondary/50 uppercase tracking-wider dg-ui-mono">
                {copy.footnote}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="mt-16 pt-12 border-t border-themeBorder/40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-8 pb-12">
          <nav className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="link-underline text-sm text-themeTextSecondary hover:text-themeAccent transition-colors uppercase tracking-[0.1em] dg-ui-mono">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-themeTextSecondary text-center md:text-left dg-ui-mono">
              <p>{footer.copyright}</p>
              <p className="mt-1 text-xs text-themeTextSecondary/50 uppercase tracking-wider">
                {footer.credit}
              </p>
              <p className="mt-2 text-[0.625rem] text-themeAccent uppercase tracking-[0.3em]">
                {footer.brandLine}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-themeTextSecondary hover:text-themeAccent transition-colors" aria-label="GitHub">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-themeTextSecondary hover:text-themeAccent transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href={`mailto:${social.email}`} className="text-themeTextSecondary hover:text-themeAccent transition-colors" aria-label="Email">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function BrandInput({ id, label, type, value, onChange, placeholder, required, autoComplete, rows, children }) {
  const isSelect = type === "select";
  const isTextarea = type === "textarea";
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[0.625rem] font-mono uppercase tracking-wider text-themeTextSecondary/70 dg-ui-mono">
        {label || id}{required && <span className="text-themeAccent">*</span>}
      </label>
      {isSelect ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full rounded-none border-2 border-themeBorder/60 bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-colors input-cyber">
          {children}
        </select>
      ) : isTextarea ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} required={required} className="w-full rounded-none border-2 border-themeBorder/60 bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-colors input-cyber resize-none" />
      ) : (
        <input id={id} type={type} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full rounded-none border-2 border-themeBorder/60 bg-themeInput px-4 py-3 text-themeText placeholder-themeTextSecondary/40 focus:outline-none focus:border-themeAccent transition-colors input-cyber" />
      )}
    </div>
  );
}

function BrandContactItem({ icon, label, value, href }) {
  return (
    <a href={href} className="flex items-start gap-2 text-themeTextSecondary hover:text-themeAccent transition-colors dg-ui-mono">
      <span className="mt-0.5">{icon}</span>
      <span className="flex flex-col">
        {label && (
          <span className="text-[0.625rem] uppercase tracking-[0.2em] text-themeAccent">
            {label}
          </span>
        )}
        <span className="text-xs uppercase tracking-[0.1em]">{value}</span>
      </span>
    </a>
  );
}

function BrandSocial({ href, icon, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-none border-2 border-themeBorder/60 text-themeTextSecondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors uppercase tracking-[0.1em] dg-ui-mono">
      {icon}
      <span>{label}</span>
    </a>
  );
}
