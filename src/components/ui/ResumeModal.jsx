"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiDownload, FiExternalLink } from "react-icons/fi";

const RESUME_DEFAULT = "/resume.pdf";

export function ResumeModal({ isOpen, onClose, resumeUrl }) {
  const url = resumeUrl || RESUME_DEFAULT;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-12 lg:inset-20 z-50 glass rounded-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-themeBorder">
              <h3 className="text-lg font-display font-semibold text-themeText">
                My Resume
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-themeAccent/10 text-themeAccent text-sm font-medium hover:bg-themeAccent/20 transition-colors"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Open
                </a>
                <a
                  href={url}
                  download
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-themeAccent text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <FiDownload className="w-4 h-4" />
                  Download
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-themeText-secondary hover:text-themeText hover:bg-themeBg-secondary transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <iframe
                src={url}
                className="w-full h-full rounded-xl border border-themeBorder"
                title="Resume PDF"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
