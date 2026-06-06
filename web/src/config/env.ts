import { Network } from "@aptos-labs/ts-sdk";

/**
 * Runtime-validated application configuration, sourced from Vite env vars
 * (`import.meta.env.VITE_*`). Importing this module fails fast with a clear
 * message if a required variable is missing, instead of silently producing
 * `undefined::undefined::mint_ticket` transaction payloads.
 */

function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        `Copy web/.env.example to web/.env.local and set it.`,
    );
  }
  return trimmed;
}

function parseNetwork(value: string | undefined): Network {
  switch ((value ?? "testnet").trim().toLowerCase()) {
    case "mainnet":
      return Network.MAINNET;
    case "testnet":
      return Network.TESTNET;
    case "devnet":
      return Network.DEVNET;
    case "local":
      return Network.LOCAL;
    default:
      throw new Error(
        `Invalid VITE_APTOS_NETWORK "${value}". ` +
          `Expected one of: mainnet, testnet, devnet, local.`,
      );
  }
}

const moduleAddress = required(
  "VITE_APTOS_MODULE_ADDRESS",
  import.meta.env.VITE_APTOS_MODULE_ADDRESS,
);
const moduleName = required(
  "VITE_APTOS_MODULE_NAME",
  import.meta.env.VITE_APTOS_MODULE_NAME,
);
const network = parseNetwork(import.meta.env.VITE_APTOS_NETWORK);

export const appConfig = { moduleAddress, moduleName, network } as const;

/** Fully-qualified Move entry/view function id, e.g. `0x1::ticket_nft::mint_ticket`. */
export function entryFunction(name: string): `${string}::${string}::${string}` {
  return `${moduleAddress}::${moduleName}::${name}`;
}
