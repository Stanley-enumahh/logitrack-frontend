import type { OrderStatus } from "../../types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-slate-100 text-slate-600",
  assigned: "bg-blue-50 text-blue-700",
  picked_up: "bg-[#EFEFEF] text-[#8F8F8F]",
  en_route: "bg-[#E2A63B33] text-[#E2A63B]",
  awaiting_confirmation: "bg-[#9333EA1A] text-[#9333EA]",
  delivered: "bg-[#D7F9E0] text-[#00FF0B]",
  disputed: "bg-red-50 text-red-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-400",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  picked_up: "Picked Up",
  en_route: "En Route",
  awaiting_confirmation: "Awaiting Confirmation",
  delivered: "Delivered",
  disputed: "Disputed",
  failed: "Failed",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex px-4 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
