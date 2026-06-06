import { describe, it, expect } from "vitest";
import { EVENTS } from "./events";

describe("EVENTS catalogue", () => {
  it("has unique ids", () => {
    const ids = EVENTS.map((event) => event.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-empty names and http(s) image URIs", () => {
    for (const event of EVENTS) {
      expect(event.name.length).toBeGreaterThan(0);
      expect(event.imageUri).toMatch(/^https?:\/\//);
    }
  });

  it("offers at least one bookable event", () => {
    expect(EVENTS.some((event) => event.available)).toBe(true);
  });
});
