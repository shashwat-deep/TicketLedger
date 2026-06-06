import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { appConfig } from "../config/env";

/**
 * Shared, read-only Aptos client configured for the network from env.
 * A single instance is reused across the app to avoid re-creating fullnode
 * connections on every render.
 */
export const aptos = new Aptos(new AptosConfig({ network: appConfig.network }));
