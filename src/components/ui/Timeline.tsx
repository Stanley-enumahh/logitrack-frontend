import type { InternalStatusEvent } from "../../api/tracking";

const STATUS_LABELS: Record<string, string> = {
  pending: "Order placed",
  assigned: "Driver assigned",
  picked_up: "Picked up",
  en_route: "En route",
  delivered: "Delivered",
  failed: "Delivery failed",
  cancelled: "Cancelled",
};

export default function Timeline({
  events,
}: {
  events: InternalStatusEvent[];
}) {
  if (events.length === 0) {
    return <p className="text-slate-400 text-sm">No events yet.</p>;
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-1.75 top-1 bottom-1 w-px bg-slate-200" />
      <div className="space-y-5">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-500" />
            <p className="text-sm font-medium text-slate-900">
              {STATUS_LABELS[event.status] ?? event.status}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {new Date(event.timestamp).toLocaleString()}
            </p>
            {event.actor_username && (
              <p className="text-xs text-slate-500 mt-0.5">
                by {event.actor_username}
              </p>
            )}
            {event.note && (
              <p className="text-xs text-slate-600 mt-1">{event.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
