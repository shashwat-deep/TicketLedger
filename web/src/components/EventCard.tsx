import type { EventInfo } from "../features/tickets/events";

interface EventCardProps {
  readonly event: EventInfo;
  readonly disabled: boolean;
  readonly onBook: () => void;
}

/** Presentational card for a single event. */
export function EventCard({ event, disabled, onBook }: EventCardProps) {
  return (
    <article className="event">
      <h3>{event.name}</h3>
      <p className="muted">{event.date}</p>
      {event.available ? (
        <button
          type="button"
          onClick={onBook}
          disabled={disabled}
          aria-label={`Book a ticket for ${event.name}`}
        >
          {disabled ? "Processing…" : "Book now"}
        </button>
      ) : (
        <p className="muted">Coming soon…</p>
      )}
    </article>
  );
}
