import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import { createOrder, type CreateOrderPayload } from "../../api/orders";
import AddressAutocomplete from "../../components/ui/AddressAutocomplete";
import type { GeocodeResult } from "../../api/geocoding";

const schema = yup.object({
  customer_name: yup.string().required("Required"),
  customer_phone: yup.string().required("Required"),
  customer_email: yup.string().email("Invalid email").required("Required"),
  priority: yup
    .mixed<"normal" | "urgent">()
    .oneOf(["normal", "urgent"])
    .required(),
  delivery_notes: yup.string().default(""),
});

type FormValues = yup.InferType<typeof schema>;

interface CreateOrderFormProps {
  onClose: () => void;
}

export default function CreateOrderForm({ onClose }: CreateOrderFormProps) {
  const queryClient = useQueryClient();
  const [pickup, setPickup] = useState<GeocodeResult | null>(null);
  const [dropoff, setDropoff] = useState<GeocodeResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { priority: "normal", delivery_notes: "" },
  });

  const mutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onClose();
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

  return (
    <div className="fixed inset-0 bg-slate-700/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">New order</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Customer name
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

          <div className="border-t border-slate-100 pt-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Delivery notes
            </label>
            <textarea
              {...register("delivery_notes")}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {mutation.isError && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              Couldn't create order. Check the fields and try again.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {mutation.isPending ? "Creating..." : "Create order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
