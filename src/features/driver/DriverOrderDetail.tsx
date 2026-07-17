import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import { fetchOrder, updateOrderStatus } from "../../api/orders";
import { fetchOrderEvents } from "../../api/tracking";
import { getCurrentPosition } from "../../hooks/useGeolocation";
import StatusBadge from "../../components/ui/StatusBadge";
import Timeline from "../../components/ui/Timeline";
import ProofOfDeliveryForm from "./ProofOfDeliveryForm";
import type { OrderStatus } from "../../types";

interface DriverOrderDetailProps {
  orderId: number;
  onClose: () => void;
}

const NEXT_ACTION: Partial<
  Record<OrderStatus, { label: string; nextStatus: OrderStatus }>
> = {
  assigned: { label: "Mark as picked up", nextStatus: "picked_up" },
  picked_up: { label: "Mark as en route", nextStatus: "en_route" },
};

export default function DriverOrderDetail({
  orderId,
  onClose,
}: DriverOrderDetailProps) {
  const queryClient = useQueryClient();
  const [showPodForm, setShowPodForm] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  const { data: events } = useQuery({
    queryKey: ["order-events", orderId],
    queryFn: () => fetchOrderEvents(orderId),
  });

  const statusMutation = useMutation({
    mutationFn: async (nextStatus: OrderStatus) => {
      const { latitude, longitude } = await getCurrentPosition();
      return updateOrderStatus(orderId, {
        status: nextStatus,
        latitude,
        longitude,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["order-events", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () =>
      setLocationError(
        "Could not get your location. Enable location access and try again.",
      ),
  });

  if (!order) return null;

  const nextAction = NEXT_ACTION[order.status];

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-slate-900">
            Delivery detail
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-sm text-slate-900">
                {order.order_number}
              </span>
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <FiUser className="w-4 h-4 text-slate-400" />{" "}
              {order.customer_name}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <FiPhone className="w-4 h-4 text-slate-400" />{" "}
              {order.customer_phone}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-start gap-2 text-sm text-slate-700">
              <FiMapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <span>{order.pickup_address}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-700">
              <FiMapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{order.dropoff_address}</span>
            </div>
          </div>

          {order.delivery_notes && (
            <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
              <p className="text-xs text-slate-500 mb-0.5">Notes</p>
              <p className="text-sm text-slate-700">{order.delivery_notes}</p>
            </div>
          )}

          {locationError && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {locationError}
            </p>
          )}

          <div className="space-y-2">
            {nextAction && (
              <button
                onClick={() => statusMutation.mutate(nextAction.nextStatus)}
                disabled={statusMutation.isPending}
                className="w-full bg-slate-900 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-800 disabled:opacity-50"
              >
                {statusMutation.isPending ? "Updating..." : nextAction.label}
              </button>
            )}

            {order.status === "en_route" && (
              <button
                onClick={() => setShowPodForm(true)}
                className="w-full bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-emerald-700"
              >
                Submit proof of delivery
              </button>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Timeline
            </p>
            {events && <Timeline events={events} />}
          </div>
        </div>
      </div>

      {showPodForm && (
        <ProofOfDeliveryForm
          orderId={orderId}
          onClose={() => setShowPodForm(false)}
          onSuccess={() => setShowPodForm(false)}
        />
      )}
    </div>
  );
}
