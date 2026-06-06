import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { ThemeToggle } from "./ThemeToggle";

/** App banner: title, tagline, theme toggle, and the wallet connect control. */
export function Header() {
  return (
    <header className="app-header card">
      <div>
        <h1>TicketLedger</h1>
        <p className="muted">Your gateway to exclusive events</p>
      </div>
      <div className="app-header__actions">
        <ThemeToggle />
        <WalletSelector />
      </div>
    </header>
  );
}
