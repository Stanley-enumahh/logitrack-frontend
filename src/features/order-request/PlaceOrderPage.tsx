import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { FiTruck, FiCheckCircle, FiCopy } from "react-icons/fi";
import { Link } from "react-router-dom";
import { createPublicOrder, type PublicOrderPayload } from "../../api/orders";
import AddressAutocomplete from "../../components/ui/AddressAutocomplete";
import type { GeocodeResult } from "../../api/geocoding";

const schema = yup.object({
  customer_name: yup.string().required("Required"),
  customer_phone: yup.string().required("Required"),
  customer_email: yup.string().email("Invalid email").required("Required"),
  delivery_notes: yup.string().default(""),
});

type FormValues = yup.InferType<typeof schema>;

export default function PlaceOrderPage() {
  const [pickup, setPickup] = useState<GeocodeResult | null>(null);
  const [dropoff, setDropoff] = useState<GeocodeResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    order_number: string;
    tracking_token: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationFn: (payload: PublicOrderPayload) => createPublicOrder(payload),
    onSuccess: (data) => {
      setResult({
        order_number: data.order_number,
        tracking_token: data.tracking_token,
      });
      reset();
      setPickup(null);
      setDropoff(null);
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!pickup || !dropoff) {
      setLocationError(
        "Please select both a pickup and dropoff address from the suggestions.",
      );
      return;
    }
    setLocationError(null);

    mutation.mutate({
      ...values,
      pickup_address: pickup.address,
      pickup_latitude: pickup.latitude,
      pickup_longitude: pickup.longitude,
      dropoff_address: dropoff.address,
      dropoff_latitude: dropoff.latitude,
      dropoff_longitude: dropoff.longitude,
    });
  };

  const trackingUrl = result
    ? `${window.location.origin}/track/${result.tracking_token}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-8 text-center">
          <FiCheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-slate-900 mb-1">
            Order placed
          </h1>
          <p className="text-slate-500 text-sm mb-4">
            Order{" "}
            <span className="font-mono text-slate-700">
              {result.order_number}
            </span>{" "}
            is in our queue.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 mb-4">
            <p className="text-xs text-slate-500 mb-1">Your tracking link</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-slate-700 truncate flex-1">
                {trackingUrl}
              </p>
              <button
                onClick={handleCopy}
                className="shrink-0 text-slate-500 hover:text-slate-700"
              >
                <FiCopy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-emerald-600 text-xs mt-1">Copied</p>}
          </div>

          <Link
            to={`/track/${result.tracking_token}`}
            className="block w-full bg-slate-900 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-800"
          >
            Track this order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <FiTruck className="text-amber-500 w-6 h-6" />
          <span className="text-slate-900 text-lg font-semibold tracking-tight">
            LogiTrack
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h1 className="text-lg font-semibold text-slate-900 mb-1">
            Place a delivery request
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            No account needed. You'll get a link to track your order live.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your name
                </label>
                <input
                  {...register("customer_name")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.customer_name && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.customer_name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  {...register("customer_phone")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.customer_phone && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.customer_phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                {...register("customer_email")}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.customer_email && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.customer_email.message}
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Pickup
              </label>
              <AddressAutocomplete
                placeholder="Search pickup address"
                onSelect={setPickup}
              />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Dropoff
              </label>
              <AddressAutocomplete
                placeholder="Search dropoff address"
                onSelect={setDropoff}
              />
            </div>

            {locationError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {locationError}
              </p>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                {...register("delivery_notes")}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {mutation.isError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
                Couldn't place your order. Check the fields and try again.
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-slate-900 text-white cursor-pointer text-sm font-medium py-2.5 rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {mutation.isPending ? "Placing order..." : "Place order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
