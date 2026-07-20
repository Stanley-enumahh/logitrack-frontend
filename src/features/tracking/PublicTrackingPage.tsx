import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  FiTruck,
  FiMapPin,
  FiPackage,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import {
  fetchPublicTracking,
  confirmDelivery,
  type ConfirmDeliveryPayload,
} from "../../api/tracking";
import StatusBadge from "../../components/ui/StatusBadge";
import PublicTimeline from "../../components/ui/PublicTimeline";
import MapView from "../../components/ui/MapView";

const ACTIVE_STATUSES = ["assigned", "picked_up", "en_route"];

interface ConfirmFormValues {
  confirmed_by_name: string;
  dispute_reason: string;
}

export default function PublicTrackingPage() {
  const { token } = useParams<{ token: string }>();
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-tracking", token],
    queryFn: () => fetchPublicTracking(token!),
    enabled: !!token,
    refetchInterval: 8000,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConfirmFormValues>({
    defaultValues: { confirmed_by_name: "", dispute_reason: "" },
  });

  const confirmerName = watch("confirmed_by_name");

  const confirmMutation = useMutation({
    mutationFn: (payload: ConfirmDeliveryPayload) =>
      confirmDelivery(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-tracking", token] });
      setShowDisputeForm(false);
    },
  });

  const onConfirmReceived = (values: ConfirmFormValues) => {
    confirmMutation.mutate({
      confirmed: true,
      confirmed_by_name: values.confirmed_by_name,
    });
  };

  const onSubmitDispute = (values: ConfirmFormValues) => {
    confirmMutation.mutate({
      confirmed: false,
      confirmed_by_name: values.confirmed_by_name,
      dispute_reason: values.dispute_reason,
    });
  };

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

            {data.proof_of_delivery.confirmation_status === "pending" && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your name
                  </label>
                  <input
                    {...register("confirmed_by_name", {
                      required: "Please enter your name",
                    })}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.confirmed_by_name && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.confirmed_by_name.message}
                    </p>
                  )}
                </div>

                {!showDisputeForm && (
                  <>
                    <p className="text-sm font-medium text-slate-900">
                      Did you receive this delivery?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSubmit(onConfirmReceived)}
                        disabled={
                          !confirmerName?.trim() || confirmMutation.isPending
                        }
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <FiThumbsUp className="w-4 h-4" /> Yes, received
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDisputeForm(true)}
                        disabled={!confirmerName?.trim()}
                        className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 text-sm font-medium py-2 rounded-md hover:bg-slate-50 disabled:opacity-50"
                      >
                        <FiThumbsDown className="w-4 h-4" /> No, I didn't
                      </button>
                    </div>
                  </>
                )}

                {showDisputeForm && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700">
                      What happened?
                    </label>
                    <textarea
                      {...register("dispute_reason", {
                        required: "Please tell us what happened",
                      })}
                      rows={2}
                      placeholder="e.g. Package never arrived, wrong address..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    {errors.dispute_reason && (
                      <p className="text-red-600 text-xs">
                        {errors.dispute_reason.message}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowDisputeForm(false)}
                        className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit(onSubmitDispute)}
                        disabled={confirmMutation.isPending}
                        className="px-3 py-1.5 bg-red-600 text-white cursor-pointer text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {data.proof_of_delivery.confirmation_status === "confirmed" && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-emerald-700 text-sm">
                <FiThumbsUp className="w-4 h-4" />
                Confirmed received by {data.proof_of_delivery.confirmed_by_name}
              </div>
            )}

            {data.proof_of_delivery.confirmation_status === "disputed" && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
                  <FiThumbsDown className="w-4 h-4" />
                  Reported as not received by{" "}
                  {data.proof_of_delivery.confirmed_by_name}
                </div>
                {data.proof_of_delivery.dispute_reason && (
                  <p className="text-xs text-slate-500">
                    {data.proof_of_delivery.dispute_reason}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
