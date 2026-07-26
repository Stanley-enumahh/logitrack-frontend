interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-slate-500 text-sm animate-pulse">{label}</p>
    </div>
  );
}