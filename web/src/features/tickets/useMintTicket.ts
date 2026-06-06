import { useCallback, useState } from "react";
import {
  useWallet,
  type InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../../lib/aptos";
import { entryFunction } from "../../config/env";
import type { EventInfo } from "./events";

export type MintStatus = "idle" | "pending" | "success" | "error";

export interface MintState {
  readonly status: MintStatus;
  readonly message: string | null;
  readonly hash: string | null;
}

const IDLE: MintState = { status: "idle", message: null, hash: null };

/**
 * Encapsulates the mint flow: builds the entry-function payload, submits it via
 * the connected wallet, waits for on-chain confirmation, and exposes a small
 * state machine the UI can render. All wallet/SDK details live here so
 * components stay presentational.
 */
export function useMintTicket() {
  // Use the wallet object directly (rather than destructuring its methods) so
  // the context-bound signAndSubmitTransaction keeps its `this` binding.
  const wallet = useWallet();
  const [state, setState] = useState<MintState>(IDLE);

  const mint = useCallback(
    async (event: EventInfo) => {
      if (!wallet.connected || !wallet.account) {
        setState({
          status: "error",
          message: "Please connect your wallet first.",
          hash: null,
        });
        return;
      }

      setState({
        status: "pending",
        message: "Processing your transaction…",
        hash: null,
      });

      try {
        const payload: InputTransactionData = {
          data: {
            function: entryFunction("mint_ticket"),
            functionArguments: [event.name, event.description, event.imageUri],
          },
        };

        // The wallet adapter types this response loosely; narrow to what we use.
        const { hash } = (await wallet.signAndSubmitTransaction(payload)) as {
          hash: string;
        };
        await aptos.waitForTransaction({ transactionHash: hash });

        setState({
          status: "success",
          message: "Ticket minted successfully!",
          hash,
        });
      } catch (error) {
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to mint the ticket. Please try again.",
          hash: null,
        });
      }
    },
    [wallet],
  );

  const reset = useCallback(() => setState(IDLE), []);

  return { ...state, mint, reset };
}
