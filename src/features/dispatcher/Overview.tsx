import { useQuery } from "@tanstack/react-query";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { fetchOverview } from "../../api/orders";
import { fetchDriverAvailability } from "../../api/auth";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface OverviewProps {
  onOrderClick: (orderId: number) => void;
}

export default function Overview({ onOrderClick }: OverviewProps) {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
    refetchInterval: 15000,
  });

  const { data: availability } = useQuery({
    queryKey: ["driver-availability"],
    queryFn: fetchDriverAvailability,
    refetchInterval: 15000,
  });

  const statCards = [
    {
      label: "Orders today",
      value: overview?.stats.total_today,
      icon: FiPackage,
      color: "#2563EB", // blue
    },
    {
      label: "Unassigned",
      value: overview?.stats.pending,
      icon: FiClock,
      color: "#E49E22", // amber
    },
    {
      label: "In transit",
      value: overview?.stats.active,
      icon: FiTruck,
      color: "#6C61EB", // purple
    },
    {
      label: "Delivered today",
      value: overview?.stats.delivered_today,
      icon: FiCheckCircle,
      color: "#00A979", // green
    },
    {
      label: "Urgent",
      value: overview?.stats.urgent,
      icon: FiAlertCircle,
      color: "#F82019", // red
    },
  ];

  return (
    <div className="px-4 space-y-4">
      <div className="border-b border-slate-100">
        <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Today's activity across your fleet
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-lg p-4"
          >
            <stat.icon className="w-4 h-4 mb-3" style={{ color: stat.color }} />
            <p className="text-2xl font-semibold text-slate-900">
              {isLoading ? "—" : stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Unassigned orders */}
        <div className="lg:col-span-2 px-4 py-6 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Needs a driver
            </h2>
            {overview && overview.unassigned_orders.length > 0 && (
              <span className="text-xs text-slate-400">
                {overview.unassigned_orders.length} pending
              </span>
            )}
          </div>

          {overview && overview.unassigned_orders.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
              <p className="text-slate-500 text-sm">
                Nothing waiting on a driver right now.
              </p>
            </div>
          )}

          {overview && overview.unassigned_orders.length > 0 && (
            <Table>
              <TableHeader className="border-none">
                <TableRow>
                  <TableHead className="text-slate-400 text-xs tracking-wide uppercase">
                    Order
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs tracking-wide uppercase">
                    Customer
                  </TableHead>
                  <TableHead className="text-slate-400 text-xs tracking-wide uppercase">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview.unassigned_orders.map((order) => (
                  <TableRow
                    key={order.id}
                    onClick={() => onOrderClick(order.id)}
                    className="cursor-pointer border-none"
                  >
                    <TableCell>
                      <p className="font-mono text-xs text-slate-700">
                        {order.order_number}
                      </p>
                      {order.priority === "urgent" && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium mt-0.5">
                          <FiClock className="w-3 h-3" /> Urgent
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {order.customer_name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Driver availability */}
        <div className="px-4 py-6 bg-white rounded-lg border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Fleet status
          </h2>

          {availability && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Available
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {availability.available}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Offline
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {availability.offline}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-sm text-slate-500">Total fleet</span>
                <span className="text-sm font-semibold text-slate-900">
                  {availability.total}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
