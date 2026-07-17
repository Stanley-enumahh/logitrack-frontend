import type { StatusEvent } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Order placed',
  assigned: 'Driver assigned',
  picked_up: 'Picked up',
  en_route: 'En route',
  delivered: 'Delivered',
  failed: 'Delivery failed',
  cancelled: 'Cancelled',
};

export default function PublicTimeline({ events }: { events: StatusEvent[] }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-1.75 top-1 bottom-1 w-px bg-slate-200" />
      <div className="space-y-5">
        {events.map((event, i) => (
          <div key={i} className="relative">
            <div
              className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 ${
                event.status === 'delivered' ? 'border-emerald-600' : 'border-amber-500'
              }`}
            />
            <p className="text-sm font-medium text-slate-900">{STATUS_LABELS[event.status] ?? event.status}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{new Date(event.timestamp).toLocaleString()}</p>
            {event.note && <p className="text-xs text-slate-600 mt-1">{event.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}