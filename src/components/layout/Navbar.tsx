import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-slate-100 bg-white font-grotesk">
      <div className="flex items-center justify-between px-6 py-5 md:px-25">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900">
            <FiTruck className="h-4 w-4 text-white" />
          </div>

          <span className="font-semibold tracking-tight text-slate-900">
            LogiTrack
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#how-it-works" className="transition hover:text-slate-900">
            How it works
          </a>

          <a href="#trust" className="transition hover:text-slate-900">
            Why LogiTrack
          </a>

          <a href="#track" className="transition hover:text-slate-900">
            Track a delivery
          </a>
        </div>

        {/* Desktop CTA */}
        <Link
          to="/place-order"
          className="hidden items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 md:flex"
        >
          Send a package
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-1 text-slate-900 transition hover:bg-slate-100 md:hidden"
        >
          {isOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden bg-white transition-all duration-300 md:hidden ${
          isOpen ? "max-h-96 border-t border-slate-100" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 py-5">
          <a
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="py-3 text-slate-700 transition hover:text-slate-900"
          >
            How it works
          </a>

          <a
            href="#trust"
            onClick={() => setIsOpen(false)}
            className="py-3 text-slate-700 transition hover:text-slate-900"
          >
            Why LogiTrack
          </a>

          <a
            href="#track"
            onClick={() => setIsOpen(false)}
            className="py-3 text-slate-700 transition hover:text-slate-900"
          >
            Track a delivery
          </a>

          <Link
            to="/place-order"
            onClick={() => setIsOpen(false)}
            className="mt-4 flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Send a package
          </Link>
        </div>
      </div>
    </nav>
  );
}
