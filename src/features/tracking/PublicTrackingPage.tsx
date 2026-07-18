import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiTruck, FiMapPin, FiPackage } from "react-icons/fi";
import { fetchPublicTracking } from "../../api/tracking";
import StatusBadge from "../../components/ui/StatusBadge";
import PublicTimeline from "../../components/ui/PublicTimeline";
import MapView from "../../components/ui/MapView";

const ACTIVE_STATUSES = ["assigned", "picked_up", "en_route"];

export default function PublicTrackingPage() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-tracking", token],
    queryFn: () => fetchPublicTracking(token!),
    enabled: !!token,
    refetchInterval: 8000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading tracking info...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-900 font-medium mb-1">
            Tracking link not found
          </p>
          <p className="text-slate-500 text-sm">
            Check the link and try again.
          </p>
        </div>
      </div>
    );
  }

  const isActive = ACTIVE_STATUSES.includes(data.status);

  const mapMarkers = [
    {
      latitude: parseFloat(data.pickup_latitude),
      longitude: parseFloat(data.pickup_longitude),
      color: "#D97706",
      label: data.pickup_address,
    },
    {
      latitude: parseFloat(data.dropoff_latitude),
      longitude: parseFloat(data.dropoff_longitude),
      color: "#059669",
      label: data.dropoff_address,
    },
    ...(isActive && data.driver_location
      ? [
          {
            latitude: parseFloat(data.driver_location.latitude),
            longitude: parseFloat(data.driver_location.longitude),
            color: "#1E293B",
            label: "Driver",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 px-4 py-5">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <FiTruck className="text-amber-500 w-5 h-5" />
          <span className="text-white font-semibold tracking-tight">
            LogiTrack
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-sm text-slate-700">
              {data.order_number}
            </span>
            <StatusBadge status={data.status} />
          </div>
          <p className="text-slate-500 text-xs">
            Placed {new Date(data.created_at).toLocaleString()}
          </p>
        </div>

        {isActive && data.driver_location && (
          <div className="flex items-center gap-2 px-1">
            <div className="relative">
              <FiTruck className="w-4 h-4 text-amber-600" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            </div>
            <p className="text-sm font-medium text-slate-900">
              Driver is on the move
            </p>
            <p className="text-xs text-slate-400 ml-auto">
              Updated{" "}
              {new Date(data.driver_location.last_updated).toLocaleTimeString()}
            </p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <MapView markers={mapMarkers} />
          <div className="p-5 space-y-3">
            <div className="flex items-start gap-2 text-sm text-slate-700">
              <FiMapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <span>{data.pickup_address}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-700">
              <FiMapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{data.dropoff_address}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Timeline
          </p>
          <PublicTimeline events={data.timeline} />
        </div>

        {data.proof_of_delivery && (
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiPackage className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-slate-900">
                Proof of delivery
              </p>
            </div>
            {data.proof_of_delivery.photo && (
              <img
                src={data.proof_of_delivery.photo}
                alt="Proof of delivery"
                className="w-full rounded-md border border-slate-200 mb-2"
              />
            )}
            {data.proof_of_delivery.recipient_name && (
              <p className="text-xs text-slate-500">
                Received by {data.proof_of_delivery.recipient_name}
              </p>
            )}
            <p className="text-xs text-slate-400 font-mono mt-1">
              {new Date(data.proof_of_delivery.captured_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
