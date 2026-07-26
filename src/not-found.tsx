import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { FiArrowLeft, FiTruck } from "react-icons/fi";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
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

export default function NotFoundPage() {
  return (
    <section className="min-h-screen bg-[#031632] relative overflow-hidden flex items-center justify-center px-6">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-2xl text-center"
      >
        <motion.div
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
        >
          <FiTruck />
          LogiTrack
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          className="mt-8 text-8xl md:text-9xl font-black text-white"
        >
          404
        </motion.h1>

        <motion.h2
          custom={2}
          variants={fadeUp}
          className="mt-4 text-3xl md:text-5xl font-bold text-white"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          custom={3}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300"
        >
          Looks like this destination doesn't exist anymore, or the link you
          followed is incorrect. Let's get you back on the right route.
        </motion.p>

        <motion.div
          custom={4}
          variants={fadeUp}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/"
            className="flex items-center hover:bg-white/90 justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#031632] transition hover:bg-slate-100"
          >
            <FiArrowLeft />
            Back Home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
