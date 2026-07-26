import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmCancelOrderModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmCancelOrderModal({
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmCancelOrderModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <FiAlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Cancel Order
            </h2>
            <p className="text-sm text-slate-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to cancel this order? The order will no longer
            continue through the delivery workflow.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Keep Order
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
