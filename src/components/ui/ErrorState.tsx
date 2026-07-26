interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-2.5">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-slate-700 hover:text-slate-900 underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}
