"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FiMessageSquare } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    quote: "Fahim built a production-grade SaaS API that handles 619,000+ villages with Redis caching, JWT auth, and tiered rate limiting. Impressive technical depth.",
    author: "TechFifo Team",
    role: "Engineering Team",
  },
  {
    quote: "The VitaSense AI project achieved 98.2% accuracy in diabetes prediction using ensemble ML models. A solid demonstration of ML engineering skills.",
    author: "Bluestock Fintech",
    role: "Data Analytics Team",
  },
  {
    quote: "UniPath is a well-designed Flutter app with OTP authentication, appointment booking, and AI chatbot. Great mobile development capabilities.",
    author: "College Project Review",
    role: "Academic Panel",
  },
  {
    quote: "Clean code, meaningful documentation, and production-ready deployments. Fahim's work stands out in both quality and presentation.",
    author: "Open Source Community",
    role: "GitHub Collaborators",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-themeAccent font-mono text-sm tracking-wider uppercase mb-3">
            What People Say
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient">
            Testimonials
          </h2>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="swiper-testimonial pb-12"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="glass rounded-2xl p-6 h-full flex flex-col">
                <FiMessageSquare className="w-8 h-8 text-themeAccent/30 mb-4" />
                <p className="text-themeText-secondary text-sm leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-themeBorder">
                  <p className="font-display font-semibold text-themeText text-sm">
                    {t.author}
                  </p>
                  <p className="text-themeText-secondary text-xs">{t.role}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
