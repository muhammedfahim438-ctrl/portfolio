"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function ProjectDetailModal({ isOpen, onClose, project }) {
  const [activeImg, setActiveImg] = useState(0);

  if (!project) return null;

  const allImages = [
    ...(project.image_url ? [project.image_url] : []),
    ...(project.images ?? []),
  ];

  const hasImages = allImages.length > 0;
  const hasVideo = !!project.video_url;

  function nextImage() {
    setActiveImg((prev) => (prev + 1) % allImages.length);
  }

  function prevImage() {
    setActiveImg((prev) => (prev - 1 + allImages.length) % allImages.length);
  }

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
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 glass rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-themeBorder shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-themeText">
                  {project.title}
                </h2>
                {project.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-themeAccent/15 text-themeAccent mt-1 inline-block">
                    {project.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-themeAccent text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <FaExternalLinkAlt className="w-3.5 h-3.5" />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                  >
                    <FaGithub className="w-4 h-4" />
                    Code
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-themeText-secondary hover:text-themeText hover:bg-themeBg-secondary transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Media Section */}
              {(hasImages || hasVideo) && (
                <div className="space-y-4">
                  {/* Image Gallery */}
                  {hasImages && (
                    <div className="relative">
                      <div className="relative rounded-xl overflow-hidden bg-themeBg-secondary border border-themeBorder">
                        <img
                          src={allImages[activeImg]}
                          alt={`${project.title} - Image ${activeImg + 1}`}
                          className="w-full h-64 md:h-96 object-contain"
                        />
                        {allImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-themeText hover:text-themeAccent transition-colors"
                            >
                              <FiChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-themeText hover:text-themeAccent transition-colors"
                            >
                              <FiChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnail strip */}
                      {allImages.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                          {allImages.map((url, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImg(i)}
                              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                activeImg === i
                                  ? "border-themeAccent"
                                  : "border-themeBorder hover:border-themeAccent/50"
                              }`}
                            >
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video Embed */}
                  {hasVideo && (
                    <div className="rounded-xl overflow-hidden border border-themeBorder">
                      <iframe
                        src={project.video_url}
                        title={`${project.title} video`}
                        className="w-full h-64 md:h-96"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-mono text-themeAccent uppercase tracking-wider mb-2">
                    About this project
                  </h3>
                  <p className="text-themeText-secondary leading-relaxed">
                    {project.long_description || project.description}
                  </p>
                </div>

                {/* Tags */}
                {project.tags?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-mono text-themeAccent uppercase tracking-wider mb-2">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-themeAccent/10 text-themeAccent border border-themeAccent/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
