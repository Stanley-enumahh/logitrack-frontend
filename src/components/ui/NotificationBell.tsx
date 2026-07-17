import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiBell,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllRead,
  markOneRead,
  type AppNotification,
  type NotificationType,
} from "../../api/notifications";
import { getRelativeTime } from "../../hooks/useRelativeTime";

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: typeof FiPackage; color: string }
> = {
  new_order: { icon: FiPackage, color: "#2563EB" },
  delivered: { icon: FiCheckCircle, color: "#00A979" },
  failed: { icon: FiXCircle, color: "#F82019" },
  urgent: { icon: FiAlertTriangle, color: "#E49E22" },
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 15000,
  });

  const { data: unread } = useQuery({
    queryKey: ["unread-count"],
    queryFn: fetchUnreadCount,
    refetchInterval: 15000,
  });

  const markAllMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const markOneMutation = useMutation({
    mutationFn: (id: number) => markOneRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = unread?.unread_count ?? 0;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 relative"
      >
        <FiBell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">
              Notifications
              {unreadCount > 0 && (
                <span className="text-slate-400 font-normal ml-1">
                  {unreadCount} unread
                </span>
              )}
            </p>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Mark read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications && notifications.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">
                No notifications yet.
              </p>
            )}

            {notifications?.map((n: AppNotification) => {
              const config = TYPE_CONFIG[n.notification_type];
              const Icon = config.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => !n.is_read && markOneMutation.mutate(n.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${
                    !n.is_read ? "bg-blue-50/30" : ""
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${config.color}1A` }}
                  >
                    <Icon className="w-3 h-3" style={{ color: config.color }} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium truncate">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {n.message}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {getRelativeTime(n.created_at)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
