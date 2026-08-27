"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { TbCertificate } from "react-icons/tb";
import { Modal } from "@/components/ui/Modal";
import { getCertifications } from "@/lib/firestore";

const VISIBLE_COUNT = 3;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CertificationsSection() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCert, setActiveCert] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getCertifications();
      setCerts(data);
    } catch {
      // silent — empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const shown = certs.slice(0, visibleCount);
  const remaining = certs.length - visibleCount;

  const handleVerify = (cert) => {
    setActiveCert(cert);
    setModalOpen(true);
  };

  return (
    <>
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="theme-eyebrow mb-3">Credentials</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient">
              Certifications
            </h2>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-themeText-secondary">
              Loading certifications…
            </div>
          ) : certs.length === 0 ? (
            <div className="text-center py-20 text-themeText-secondary">
              No certifications yet.
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {shown.map((cert) => (
                  <motion.div
                    key={cert.id ?? cert.title}
                    variants={cardVariants}
                    whileHover={{ y: -4 }}
                    className="cert-card glass rounded-2xl p-6 flex flex-col items-center text-center space-y-4 cursor-pointer group"
                    onClick={() => handleVerify(cert)}
                  >
                    <div className="cert-badge w-20 h-20 rounded-2xl bg-themeBg-secondary border border-themeBorder flex items-center justify-center overflow-hidden">
                      {cert.badge_image_url ? (
                        <img
                          src={cert.badge_image_url}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <TbCertificate className="w-10 h-10 text-themeAccent group-hover:scale-110 transition-transform" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-display font-semibold text-themeText text-base">
                        {cert.title}
                      </h3>
                      <p className="text-themeText-secondary text-sm mt-1">
                        {cert.issuer}
                      </p>
                      {cert.issue_date && (
                        <p className="text-themeText-secondary/60 text-xs mt-0.5">
                          {cert.issue_date}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(cert);
                      }}
                      className="px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                    >
                      Verify
                    </button>
                  </motion.div>
                ))}
              </motion.div>

              {remaining > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mt-10"
                >
                  <button
                    onClick={() => setVisibleCount((c) => c + VISIBLE_COUNT)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-themeBorder text-themeText-secondary hover:border-themeAccent hover:text-themeAccent transition-colors font-medium"
                  >
                    View More
                    <span className="font-mono text-xs text-themeAccent">
                      +{remaining}
                    </span>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Certificate Verification"
      >
        {activeCert && (
          <div className="space-y-4 text-themeText-secondary">
            <div className="flex items-center gap-3">
              <TbCertificate className="w-10 h-10 text-themeAccent shrink-0" />
              <div>
                <p className="font-display font-semibold text-themeText">
                  {activeCert.title}
                </p>
                <p className="text-sm">{activeCert.issuer}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              This certificate has been issued to Muhammed Fahim M by{" "}
              {activeCert.issuer} in {activeCert.issue_date ?? "the stated year"}.{" "}
              {activeCert.credential_url ? (
                <>
                  Verification is handled through the issuer&apos;s official
                  portal:
                </>
              ) : (
                "Verification is currently handled through the issuer's official portal."
              )}
            </p>
            {activeCert.credential_url && (
              <a
                href={activeCert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-4 py-2 rounded-lg bg-themeAccent text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Verify Certificate ↗
              </a>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}