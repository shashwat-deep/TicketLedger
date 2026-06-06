import type { ReactNode } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

/** Renders its children only when a wallet is connected, otherwise a prompt. */
export function WalletGate({ children }: { children: ReactNode }) {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <section className="card" aria-label="Wallet connection required">
        <p>Please connect your wallet to continue.</p>
        <WalletSelector />
      </section>
    );
  }

  return <>{children}</>;
}
