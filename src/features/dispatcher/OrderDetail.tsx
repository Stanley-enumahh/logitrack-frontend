import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { fetchOrder, assignDriver } from "../../api/orders";
import { fetchDriverList } from "../../api/auth";

import { fetchOrderEvents } from "../../api/tracking";
import StatusBadge from "../../components/ui/StatusBadge";
import Timeline from "../../components/ui/Timeline";
import type { User } from "../../types";

interface OrderDetailProps {
  orderId: number;
  onClose: () => void;
}

export default function OrderDetail({ orderId, onClose }: OrderDetailProps) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const [selectedDriverId, setSelectedDriverId] = useState<string>("");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  const { data: events } = useQuery({
    queryKey: ["order-events", orderId],
    queryFn: () => fetchOrderEvents(orderId),
  });

  const { data: driversData } = useQuery({
    queryKey: ["drivers", 1],
    queryFn: () => fetchDriverList(1),
    enabled: order?.status === "pending",
  });

  const drivers = driversData?.results;

  const handleCopyTrackingLink = () => {
    if (!order) return;
    const trackingUrl = `${window.location.origin}/track/${order.tracking_token}`;
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const assignMutation = useMutation({
    mutationFn: (driverId: number) => assignDriver(orderId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["order-events", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleAssign = () => {
    if (selectedDriverId) {
      assignMutation.mutate(Number(selectedDriverId));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-slate-900">
            Order detail
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {isLoading && <p className="p-6 text-sm text-slate-500">Loading...</p>}

        {order && (
          <div className="px-6 py-5 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sm text-slate-900">
                  {order.order_number}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-400 font-mono mb-3">
                Created {new Date(order.created_at).toLocaleString()}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                <p className="text-xs text-slate-500 mb-1">Tracking ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-slate-700 truncate flex-1">
                    {order.tracking_token}
                  </p>
                  <button
                    onClick={handleCopyTrackingLink}
                    className="shrink-0 flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5 text-emerald-600" />{" "}
                        Copied
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-3.5 h-3.5" /> Copy link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Customer
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiUser className="w-4 h-4 text-slate-400" />{" "}
                {order.customer_name}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiPhone className="w-4 h-4 text-slate-400" />{" "}
                {order.customer_phone}
              </div>
              {order.customer_email && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <FiMail className="w-4 h-4 text-slate-400" />{" "}
                  {order.customer_email}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Route
              </p>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <FiMapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>{order.pickup_address}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <FiMapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{order.dropoff_address}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Driver
              </p>
              {order.assigned_driver_detail ? (
                <div className="text-sm text-slate-700">
                  <p className="font-medium">
                    {order.assigned_driver_detail.username}
                  </p>
                  {order.assigned_driver_detail.driver_profile && (
                    <p className="text-xs text-slate-500">
                      {order.assigned_driver_detail.driver_profile.vehicle_type}{" "}
                      ·{" "}
                      {
                        order.assigned_driver_detail.driver_profile
                          .vehicle_plate_number
                      }
                    </p>
                  )}
                </div>
              ) : order.status === "pending" ? (
                <div className="flex gap-2">
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select a driver</option>
                    {drivers?.map((driver: User) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.username}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssign}
                    disabled={!selectedDriverId || assignMutation.isPending}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 disabled:opacity-50"
                  >
                    Assign
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No driver assigned</p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Timeline
              </p>
              {events && <Timeline events={events} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
