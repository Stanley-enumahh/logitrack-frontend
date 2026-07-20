import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiChevronRight } from "react-icons/fi";
import { fetchOrders } from "../../api/orders";
import StatusBadge from "../../components/ui/StatusBadge";
import type { Order, OrderStatus } from "../../types";

interface DriverOrderListProps {
  onOrderClick: (orderId: number) => void;
}

interface Tab {
  key: string;
  label: string;
  dotColor: string;
  statuses: OrderStatus[];
}

const TABS: Tab[] = [
  {
    key: "assigned",
    label: "Assigned",
    dotColor: "#2563EB",
    statuses: ["assigned"],
  },
  {
    key: "in_progress",
    label: "In Progress",
    dotColor: "#E49E22",
    statuses: ["picked_up", "en_route"],
  },
  {
    key: "awaiting",
    label: "Awaiting Confirmation",
    dotColor: "#9333EA",
    statuses: ["awaiting_confirmation"],
  },
  {
    key: "completed",
    label: "Completed",
    dotColor: "#00A979",
    statuses: ["delivered"],
  },
  {
    key: "issues",
    label: "Issues",
    dotColor: "#F82019",
    statuses: ["failed", "cancelled", "disputed"],
  },
];

export default function DriverOrderList({
  onOrderClick,
}: DriverOrderListProps) {
  const [activeTab, setActiveTab] = useState<string>("assigned");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", 1],
    queryFn: () => fetchOrders(1),
    refetchInterval: 10000,
  });

  const orders = data?.results ?? [];

  const activeCount = orders.filter(
    (o) => !["delivered", "failed", "cancelled"].includes(o.status),
  ).length;

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const tabOrders = orders.filter((o) =>
    currentTab.statuses.includes(o.status),
  );

  const getTabCount = (tab: Tab) =>
    orders.filter((o) => tab.statuses.includes(o.status)).length;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          My deliveries
        </h1>
        <p className="text-slate-500 text-sm mb-4">
          Assigned orders, grouped by stage
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
            Active: {activeCount}/{orders.length}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
            Total: {data?.count ?? 0}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: tab.dotColor }}
              />
              {tab.label}
              <span className="text-xs text-slate-400">{getTabCount(tab)}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-slate-500 text-sm">Loading...</p>}

      {!isLoading && (
        <div className="space-y-2.5">
          {tabOrders.length === 0 && (
            <div className="border border-dashed border-slate-200 rounded-lg py-12 text-center">
              <p className="text-sm text-slate-400">Nothing here</p>
            </div>
          )}

          {tabOrders.map((order: Order) => (
            <button
              key={order.id}
              onClick={() => onOrderClick(order.id)}
              className="w-full bg-white border border-slate-200 rounded-lg p-4 text-left hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-slate-500">
                  {order.order_number}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-2">
                {order.customer_name}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <FiMapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{order.dropoff_address}</span>
                <FiChevronRight className="w-3.5 h-3.5 ml-auto shrink-0 text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
