/** Full-screen busy indicator shown while a transaction is in flight. */
export function LoadingOverlay() {
  return (
    <div className="loading-overlay" role="alert" aria-busy="true">
      <p className="loading-message">Processing your transaction…</p>
    </div>
  );
}
