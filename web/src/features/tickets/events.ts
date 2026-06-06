/**
 * Demo event catalogue. In a production deployment this would come from an
 * indexer or off-chain metadata service; it is kept as static data here so the
 * sample app has something to render.
 */
export interface EventInfo {
  /** Stable identifier used as a React key. */
  readonly id: string;
  /** Display name; also used as the minted ticket's token name. */
  readonly name: string;
  /** Human-readable date label. */
  readonly date: string;
  /** Ticket description stored on-chain. */
  readonly description: string;
  /** Metadata/image URI stored on-chain. */
  readonly imageUri: string;
  /** Whether this event can currently be booked. */
  readonly available: boolean;
}

export const EVENTS: readonly EventInfo[] = [
  {
    id: "hotpause-concert",
    name: "HotPause Concert",
    date: "16 December 2024",
    description: "Exclusive concert ticket",
    imageUri: "https://ticketledger.example/tickets/hotpause.json",
    available: true,
  },
  {
    id: "blockchain-expo",
    name: "Blockchain Expo",
    date: "Coming soon",
    description: "Blockchain Expo entry ticket",
    imageUri: "https://ticketledger.example/tickets/expo.json",
    available: false,
  },
  {
    id: "india-blockchain-week-2024",
    name: "India Blockchain Week 2024",
    date: "Coming soon",
    description: "India Blockchain Week 2024 pass",
    imageUri: "https://ticketledger.example/tickets/ibw.json",
    available: false,
  },
];
