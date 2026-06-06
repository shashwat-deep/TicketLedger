/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Address the TicketNFT Move package is published under. */
  readonly VITE_APTOS_MODULE_ADDRESS: string;
  /** Move module name exposing the entry functions. */
  readonly VITE_APTOS_MODULE_NAME: string;
  /** Target Aptos network: mainnet | testnet | devnet | local. */
  readonly VITE_APTOS_NETWORK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
