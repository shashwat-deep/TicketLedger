import { EVENTS } from "../features/tickets/events";
import { useMintTicket } from "../features/tickets/useMintTicket";
import { EventCard } from "./EventCard";
import { LoadingOverlay } from "./LoadingOverlay";

/** Lists bookable events and orchestrates the mint flow + status feedback. */
export function EventList() {
  const { status, message, mint } = useMintTicket();
  const pending = status === "pending";

  return (
    <section className="card events" aria-labelledby="events-heading">
      <h2 id="events-heading">Upcoming events</h2>

      {pending && <LoadingOverlay />}

      {message && (
        <p className={`status status--${status}`} role="status" aria-live="polite">
          {message}
        </p>
      )}

      <ul className="event-list" role="list">
        {EVENTS.map((event) => (
          <li key={event.id}>
            <EventCard
              event={event}
              disabled={pending}
              onBook={() => void mint(event)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
