# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims
to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Commit
messages follow [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

_Nothing yet._

## [1.0.0] — 2026-06-06

Full modernization overhaul. The pre-overhaul project is preserved on the `main`
branch as a baseline.

### ⚠️ Breaking changes

- **Contract ABI replaced.** Module renamed `moduleAddress::TicketNFT` →
  `ticketledger::ticket_nft`; `mint_ticket` now takes `(name, description, uri)`
  instead of `(id: u64, name, description, image_url)`. Any prior integration
  must be updated.
- **Env variables renamed** `REACT_APP_MODULE_*` → `VITE_APTOS_MODULE_*`, plus
  a new `VITE_APTOS_NETWORK`.

### Added

- Real, transferable ticket NFTs via the Aptos Digital Asset standard, a shared
  `TicketLedger Events` collection, `TicketMinted` event, and `#[view]`s.
- 4 Move unit tests and 10 Vitest tests (config, catalogue, component, theme).
- Light/dark theming (`light-dark()` tokens + persisted `useTheme`) and
  accessibility: focus-visible, skip link, AA contrast, reduced-motion,
  `aria-live` status, labelled controls.
- Runtime-validated env config that fails fast on missing variables.
- Prettier, type-aware ESLint + `eslint-plugin-jsx-a11y`, and GitHub Actions CI
  (web: lint/typecheck/test/build; contract: compile/test).
- Project docs: `ARCHITECTURE.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `LICENSE`, and the `docs/` audit/recovery/license reports.

### Changed

- Repository restructured: `nft2/aptos` → `contracts`, `ticketledger` → `web`.
- `App.tsx` monolith split into config / lib / feature / component layers.
- Transactions now wait for confirmation via `aptos.waitForTransaction`.
- Move framework dependency pinned to the `mainnet` branch (was `main`).
- Dev toolchain updated; safe minor/patch dependency bumps applied.

### Fixed

- **Minting was completely broken**: CRA-style `process.env` in a Vite app +
  an unloaded `src/.env` resolved to `undefined::undefined::mint_ticket`.
- **Frontend ↔ contract ABI mismatch**: a `String` was sent where a `u64` was
  expected, aborting every transaction.
- **One-ticket-per-account**: `move_to` aborted on a second mint.
- `npm run lint` crashed due to an eslint/typescript-eslint version mismatch.

### Removed

- 300+ committed Move build artifacts; duplicate `pnpm-lock.yaml`; dead
  `dotenv` dependency; Solidity-only `.prettierrc`; the stock Vite README.

### Security

- Stopped committing env files (`.env` now ignored; `.env.example` provided).
  Note: the committed value was a _public_ on-chain module address, not a secret.
- Reviewed dependency licenses — no GPL/LGPL/AGPL copyleft present. See
  [`docs/LICENSE_AUDIT.md`](./docs/LICENSE_AUDIT.md).

## [0.0.0] — baseline

Imported the original project as received (`main` branch).

[Unreleased]: https://github.com/your-org/ticketledger/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-org/ticketledger/releases/tag/v1.0.0
