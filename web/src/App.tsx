import "./App.css";
import { Header } from "./components/Header";
import { WalletGate } from "./components/WalletGate";
import { EventList } from "./components/EventList";

export default function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main" className="app-main">
        <WalletGate>
          <EventList />
        </WalletGate>
      </main>
    </div>
  );
}
