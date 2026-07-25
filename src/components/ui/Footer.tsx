import { FiTruck } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-100 px-6 md:px-10 py-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FiTruck className="text-slate-400 w-4 h-4" />
          <span className="text-sm text-slate-500">LogiTrack</span>
        </div>
      </div>
    </footer>
  );
};
