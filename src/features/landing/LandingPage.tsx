import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  FiTruck,
  FiMapPin,
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiPackage,
} from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import { Hero } from "./Hero";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: "easeOut",
    },
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [trackingInput, setTrackingInput] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingInput.trim();
    if (!trimmed) return;
    const match = trimmed.match(/track\/([a-f0-9-]+)/i);
    const token = match ? match[1] : trimmed;
    navigate(`/track/${token}`);
  };

  return (
    <div className="min-h-screen bg-white font-grotesk">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Trust stats row */}
      <motion.section
        id="trust"
        className="border-y border-slate-100 bg-slate-50 py-8 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Every order timestamped
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Immutable status history, start to finish
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              Photo-verified deliveries
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Proof captured at the point of handoff
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              Confirmed by you
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Not just the driver's report
            </p>
          </div>
        </div>
      </motion.section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="px-6 md:px-10 py-20 max-w-4xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold text-slate-900 text-center mb-12"
        >
          How it works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: FiPackage,
              title: "Place your order",
              desc: "No account needed. Just pickup, dropoff, and contact details.",
            },
            {
              icon: FiTruck,
              title: "We pick it up",
              desc: "A driver is assigned, and your delivery is on its way.",
            },
            {
              icon: FiMapPin,
              title: "Track and confirm",
              desc: "Watch it live, then confirm you received it.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 text-sm font-semibold">
                {i + 1}
              </div>
              <step.icon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-900 mb-1">
                {step.title}
              </p>
              <p className="text-xs text-slate-500">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="px-6 md:px-10 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: FiMapPin,
              title: "Live GPS tracking",
              desc: "Not just a status label — see the actual route.",
            },
            {
              icon: FiCamera,
              title: "Proof of delivery",
              desc: "Photo and recipient name, every time.",
            },
            {
              icon: FiCheckCircle,
              title: "Customer confirmation",
              desc: "You verify receipt, independently.",
            },
            {
              icon: FiClock,
              title: "Full timeline",
              desc: "Every status change, timestamped and visible.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="bg-white border border-slate-200 rounded-lg p-5"
            >
              <item.icon className="w-5 h-5 text-amber-600 mb-3" />
              <p className="text-sm font-medium text-slate-900 mb-1">
                {item.title}
              </p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Track a delivery mini-tool */}
      <motion.section
        id="track"
        className="px-6 md:px-10 py-20 max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Track a delivery
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Paste your tracking link or code below
        </p>
        <form onSubmit={handleTrack} className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Tracking link or code"
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-slate-800"
          >
            Track
          </button>
        </form>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 md:px-10 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FiTruck className="text-slate-400 w-4 h-4" />
            <span className="text-sm text-slate-500">LogiTrack</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
