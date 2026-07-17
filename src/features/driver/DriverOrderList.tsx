import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiChevronRight } from "react-icons/fi";
import { fetchOrders } from "../../api/orders";
import StatusBadge from "../../components/ui/StatusBadge";
import type { Order, OrderStatus } from "../../types";

interface DriverOrderListProps {
  onOrderClick: (orderId: number) => void;
}

interface Column {
  key: string;
  label: string;
  dotColor: string;
  statuses: OrderStatus[];
}

const COLUMNS: Column[] = [
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
    key: "completed",
    label: "Completed",
    dotColor: "#00A979",
    statuses: ["delivered"],
  },
  {
    key: "issues",
    label: "Issues",
    dotColor: "#F82019",
    statuses: ["failed", "cancelled"],
  },
];

export default function DriverOrderList({
  onOrderClick,
}: DriverOrderListProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["orders", 1],
    queryFn: () => fetchOrders(1),
    refetchInterval: 10000,
  });

  const orders = data?.results ?? [];

  const getColumnOrders = (column: Column) =>
    orders.filter((o) => column.statuses.includes(o.status));

  const activeCount = orders.filter(
    (o) => !["delivered", "failed", "cancelled"].includes(o.status),
  ).length;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          My deliveries
        </h1>
        <p className="text-slate-500 text-sm mb-4">
          Assigned orders, grouped by stage
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
            Active: {activeCount}/{orders.length}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
            Total: {data?.count ?? 0}
          </span>
        </div>
      </div>

      {isLoading && <p className="text-slate-500 text-sm">Loading...</p>}

      {!isLoading && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((column) => {
            const columnOrders = getColumnOrders(column);
            return (
              <div key={column.key} className="w-72 shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: column.dotColor }}
                  />
                  <h2 className="text-sm font-semibold text-slate-900">
                    {column.label}
                  </h2>
                  <span className="text-xs text-slate-400">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {columnOrders.length === 0 && (
                    <div className="border border-dashed border-slate-200 rounded-lg py-8 text-center">
                      <p className="text-xs text-slate-400">Nothing here</p>
                    </div>
                  )}

                  {columnOrders.map((order: Order) => (
                    <button
                      key={order.id}
                      onClick={() => onOrderClick(order.id)}
                      className="w-full bg-white border border-slate-200 hover:scale-[1.02] rounded-lg p-3.5 text-left hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-slate-500">
                          {order.order_number}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm font-medium text-slate-900 mb-2 truncate">
                        {order.customer_name}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiMapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {order.dropoff_address}
                        </span>
                        <FiChevronRight className="w-3.5 h-3.5 ml-auto shrink-0 text-slate-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
