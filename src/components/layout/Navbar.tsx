import { Link } from "react-router-dom";
import { FiTruck } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="flex font-grotesk items-center justify-between px-6 md:px-10 py-5 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
          <FiTruck className="text-white w-4 h-4" />
        </div>
        <span className="text-slate-900 font-semibold tracking-tight">
          LogiTrack
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
        <a href="#how-it-works" className="hover:text-slate-900">
          How it works
        </a>
        <a href="#trust" className="hover:text-slate-900">
          Why LogiTrack
        </a>
        <a href="#track" className="hover:text-slate-900">
          Track a delivery
        </a>
      </div>

      <Link
        to="/place-order"
        className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-slate-800 transition-colors"
      >
        Send a package
      </Link>
    </nav>
  );
}
