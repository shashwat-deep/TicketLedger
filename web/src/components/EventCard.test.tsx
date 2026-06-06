import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventCard } from "./EventCard";
import type { EventInfo } from "../features/tickets/events";

const baseEvent: EventInfo = {
  id: "demo",
  name: "Demo Show",
  date: "Today",
  description: "A demo",
  imageUri: "https://example.com/x.json",
  available: true,
};

describe("EventCard", () => {
  it("renders a labelled book button and fires onBook when clicked", async () => {
    const onBook = vi.fn();
    render(<EventCard event={baseEvent} disabled={false} onBook={onBook} />);

    const button = screen.getByRole("button", {
      name: /book a ticket for demo show/i,
    });
    await userEvent.click(button);

    expect(onBook).toHaveBeenCalledOnce();
  });

  it("disables the button while a mint is pending", () => {
    render(<EventCard event={baseEvent} disabled onBook={vi.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows a coming-soon label and no button for unavailable events", () => {
    render(
      <EventCard
        event={{ ...baseEvent, available: false }}
        disabled={false}
        onBook={vi.fn()}
      />,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });
});
