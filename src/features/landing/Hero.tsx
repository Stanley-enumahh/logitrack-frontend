import heroImg from "@/assets/shipping-port-sunset-cargo-airplanes-trucks.jpg";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { FiTruck, FiMapPin, FiArrowRight, FiPackage } from "react-icons/fi";

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

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] mt-16 overflow-hidden flex items-center px-6 md:px-25 py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Left Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-[#031632] via-[#031632]/80 via-45% to-transparent" />

      {/* Extra dark overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <motion.div initial="hidden" animate="visible">
          <motion.span
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-xs font-medium text-white bg-white/10 border border-white/20 rounded-lg px-3 py-1 mb-5 backdrop-blur-sm"
          >
            <FiTruck className="w-4 h-4" />
            Local Delivery &amp; Logistics
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
          >
            Fast &amp; Reliable Delivery.
            <br />
            Every Step Tracked.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-xl text-base md:text-lg text-slate-200 leading-8"
          >
            We make local delivery simple, fast, and transparent with live
            tracking, secure handling, and delivery confirmation you can trust.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Link
              to="/place-order"
              className="flex w-fit items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#031632] transition hover:bg-slate-100"
            >
              <FiPackage className="w-4 h-4" />
              Send a Package
              <FiArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/track"
              className="flex w-fit items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <FiMapPin className="w-4 h-4" />
              Track a Delivery
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
