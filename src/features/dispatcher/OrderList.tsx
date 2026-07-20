import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiClock, FiSearch } from "react-icons/fi";
import { fetchOrders } from "../../api/orders";
import StatusBadge from "../../components/ui/StatusBadge";
import type { OrderStatus } from "../../types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Pagination from "../../components/ui/Pagination";

interface OrderListProps {
  onOrderClick: (orderId: number) => void;
}

const FILTER_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "En Route", value: "en_route" },
  { label: "Awaiting Confirmation", value: "awaiting_confirmation" },
  { label: "Delivered", value: "delivered" },
  { label: "Disputed", value: "disputed" },
];

export default function OrderList({ onOrderClick }: OrderListProps) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 15;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", page, filter],
    queryFn: () => fetchOrders(page, filter),
  });

  const orders = data?.results;

  // Search stays client-side (only searches within the current page/filter) —
  // a full search-across-all-orders would need a backend search param too
  const filtered = orders?.filter(
    (o) =>
      !search ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="px-4 space-y-4">
      {/* Header */}
      <div className="b border-b  border-slate-100">
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="text-slate-500 text-sm mt-1">
          {data?.count ?? 0} total &middot; live delivery tracking
        </p>
      </div>

      <div className="px-4 py-6 w-full bg-white rounded-lg">
        <div className="flex flex-col w-full justify-between sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm bg-[#fbfbfb]/80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders or customers"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent"
            />
          </div>

          <div className="flex items-center flex-wrap gap-1 bg-white/20 border border-gray-200 rounded-lg p-1 w-full sm:w-fit">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setFilter(tab.value);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  filter === tab.value
                    ? "bg-black text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <p className="text-slate-500 text-sm">Loading orders...</p>
        )}
        {isError && (
          <p className="text-red-600 text-sm">Couldn't load orders.</p>
        )}

        {filtered && filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-500 text-sm">No orders match this view.</p>
          </div>
        )}

        {filtered && filtered.length > 0 && (
          <>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((order) => (
                <div
                  key={order.id}
                  onClick={() => onOrderClick(order.id)}
                  className="border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-slate-500">
                      {order.order_number}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {order.customer_name}
                  </p>
                  <div className="text-xs text-slate-500">
                    <div className="truncate">{order.pickup_address}</div>
                    <div className="truncate text-slate-400">
                      → {order.dropoff_address}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
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
                      Route
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs tracking-wide uppercase">
                      Driver
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs tracking-wide uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs tracking-wide uppercase">
                      Last update
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((order) => (
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
                      <TableCell className="text-slate-700 capitalize">
                        {order.customer_name}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs max-w-xs">
                        <div className="truncate">{order.pickup_address}</div>
                        <div className="truncate text-slate-400">
                          → {order.dropoff_address}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700 capitalize text-xs">
                        {order.assigned_driver_detail?.username ?? (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs font-mono">
                        {new Date(order.updated_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && (
                <Pagination
                  page={page}
                  totalCount={data.count}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
