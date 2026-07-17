import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX, FiCamera } from "react-icons/fi";
import { submitProofOfDelivery } from "../../api/tracking";
import { getCurrentPosition } from "../../hooks/useGeolocation";

interface ProofOfDeliveryFormProps {
  orderId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProofOfDeliveryForm({
  orderId,
  onClose,
  onSuccess,
}: ProofOfDeliveryFormProps) {
  const queryClient = useQueryClient();
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!photo) throw new Error("Photo is required.");
      const { latitude, longitude } = await getCurrentPosition();
      return submitProofOfDelivery(orderId, {
        photo,
        recipient_name: recipientName,
        latitude,
        longitude,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["order-events", orderId] });
      onSuccess();
    },
    onError: (err: Error) => setError(err.message ?? "Something went wrong."),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            Proof of delivery
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Photo
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg h-40 cursor-pointer hover:border-amber-400 transition-colors overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Proof preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <FiCamera className="w-6 h-6 mb-1" />
                  <span className="text-xs">Tap to capture or upload</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Recipient name (optional)
            </label>
            <input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={() => mutation.mutate()}
            disabled={!photo || mutation.isPending}
            className="w-full bg-slate-900 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-800 disabled:opacity-50"
          >
            {mutation.isPending ? "Submitting..." : "Confirm delivery"}
          </button>
        </div>
      </div>
    </div>
  );
}
