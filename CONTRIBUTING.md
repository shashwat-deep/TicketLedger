# Contributing to TicketLedger

Thanks for your interest in improving TicketLedger! This guide covers the dev
setup and the conventions we follow.

## Code of Conduct

By participating you agree to uphold our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Project layout

| Path         | What                                            |
| ------------ | ----------------------------------------------- |
| `contracts/` | Aptos Move package (`ticketledger::ticket_nft`) |
| `web/`       | Vite + React + TypeScript client                |
| `docs/`      | Audit, recovery, and license documents          |

## Getting set up

```bash
# Web client
cd web && npm install && cp .env.example .env.local && npm run dev

# Contract (needs the Aptos CLI)
cd contracts && aptos move test
```

## Before you open a PR

Run the same checks CI runs and make sure they pass:

```bash
# in web/
npm run lint
npm run typecheck
npm run format:check   # or: npm run format
npm run test:run
npm run build

# in contracts/
aptos move test
```

## Commit messages — Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) so history
stays readable and future tooling (e.g. semantic-release) can derive versions:

```
<type>(<scope>): <summary>

<body>

<footer>
```

- **Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`.
- **Scopes (examples):** `contract`, `web`, `repo`, `tooling`.
- **Breaking changes:** add a `BREAKING CHANGE:` footer (or `!` after the type),
  e.g. `feat(contract)!: change mint_ticket arguments`.

Examples:

```
fix(web): wait for transaction confirmation before showing success
feat(contract): add a #[view] for collection metadata
```

## Coding standards

- **Formatting** is owned by Prettier (`.prettierrc.json`); don't hand-format.
- **Linting** is type-aware ESLint with `jsx-a11y`. Keep new code lint-clean;
  prefer fixing over `eslint-disable` (and justify any disable inline).
- **TypeScript** runs in `strict` mode — avoid `any`; type external boundaries.
- **Accessibility** is a requirement, not a nice-to-have: semantic HTML,
  labelled controls, keyboard operability, sufficient contrast.
- **Components stay presentational** — wallet/SDK logic belongs in
  `features/*/use*.ts` (see [ARCHITECTURE.md](./ARCHITECTURE.md)).

## Tests

- Add/adjust tests for behavior you change. If the optimized logic is correct,
  update tests to match it rather than preserving stale assertions.
- Web tests: Vitest + Testing Library next to the code (`*.test.ts[x]`).
- Contract tests: `#[test]` functions in the module.

## Branching & PRs

1. Branch from the default branch (`type/short-description`).
2. Keep PRs focused; describe the change and how you verified it.
3. Ensure CI is green. Update `CHANGELOG.md` under `[Unreleased]` for
   user-visible changes.
