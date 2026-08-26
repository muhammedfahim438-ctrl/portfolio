"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TbCertificate } from "react-icons/tb";
import { Modal } from "@/components/ui/Modal";

const certifications = [
  {
    title: "Programming Fundamentals",
    issuer: "Infosys Springboard",
    year: "2026",
  },
  {
    title: "n8n Workflow Automation",
    issuer: "n8n",
    year: "2026",
  },
  {
    title: "Linguaskill",
    issuer: "Cambridge",
    year: "2026",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CertificationsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCert, setActiveCert] = useState(null);

  const handleVerify = (cert) => {
    setActiveCert(cert);
    setModalOpen(true);
  };

  return (
    <>
      <section className="py-20 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gradient"
        >
          Certifications
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-themeBg-secondary border border-themeBorder flex items-center justify-center">
                <TbCertificate className="w-8 h-8 text-themeAccent" />
              </div>

              <div>
                <h3 className="font-display font-semibold text-themeText text-lg">
                  {cert.title}
                </h3>
                <p className="text-themeText-secondary text-sm mt-1">
                  {cert.issuer}
                </p>
                <p className="text-themeText-secondary text-xs mt-0.5">
                  {cert.year}
                </p>
              </div>

              <button
                onClick={() => handleVerify(cert)}
                className="px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
              >
                Verify
              </button>
            </motion.div>
          ))}
        </motion.div>
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
              {activeCert.issuer} in {activeCert.year}. Verification is
              currently handled through the issuer&apos;s official portal.
            </p>
            <p className="text-xs text-themeText-secondary/60">
              Credential verification link will be available soon.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
