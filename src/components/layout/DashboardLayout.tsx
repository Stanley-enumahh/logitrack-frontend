import { useState, type ReactNode } from "react";
import { FiTruck, FiLogOut, FiMenu, FiX, FiPlus } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../ui/NotificationBell";

interface NavItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  active: boolean;
  count?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

export default function DashboardLayout({
  children,
  navItems,
  onPrimaryAction,
  primaryActionLabel = "New",
}: DashboardLayoutProps) {
  const { username, logout, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavClick = (onClick: () => void) => {
    onClick();
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <FiTruck className="text-slate-900 w-5 h-5" />
          <span className="text-slate-900 font-semibold tracking-tight">
            LogiTrack
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-slate-500"
        >
          <FiMenu className="w-5 h-5" />
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/30 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 h-full bg-white border-r border-slate-200 flex flex-col shrink-0
          transform transition-transform duration-200
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-5 py-5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
              <FiTruck className="text-white w-4 h-4" />
            </div>
            <span className="text-slate-900 font-semibold tracking-tight">
              LogiTrack
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.onClick)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="w-4 h-4 shrink-0">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && (
                <span className="text-xs text-slate-400 font-normal">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
              {username?.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-sm text-slate-700 truncate flex-1">{username}</p>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-slate-700"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="hidden md:flex items-center gap-3 px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex-1 max-w-lg relative">
            <input
              placeholder="Ask anything about your orders, drivers, or deliveries..."
              className="w-full pl-4 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              disabled
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            {role === "dispatcher" && <NotificationBell />}
            {onPrimaryAction && (
              <button
                onClick={onPrimaryAction}
                className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                {primaryActionLabel}
              </button>
            )}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#F9F9F9] px-1 py-2">
          {children}
        </main>
      </div>
    </div>
  );
}
