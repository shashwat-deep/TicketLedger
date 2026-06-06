# Disaster Recovery & Rollback Plan

TicketLedger has a small but unusual failure surface: a **static SPA** (trivially
redeployable) and an **on-chain Move module** (effectively immutable once
published). This plan covers both.

## What must be backed up

There is no database and no user-uploaded media (ticket image URIs point to
external storage). The assets that actually matter:

| Asset                             | Where it lives            | Backup strategy                                                                                                                                |
| --------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Deployer account key/mnemonic** | Operator's secret store   | **Critical.** Store in a secrets manager / hardware wallet; losing it means you can never upgrade the module at that address. Never commit it. |
| Move source & frontend code       | Git                       | Mirror the repo (e.g. GitHub + a second remote).                                                                                               |
| Deployment config                 | `web/.env.*`, `Move.toml` | Record the published address + network out-of-band.                                                                                            |
| Built frontend artifact           | CI / host                 | Keep the last known-good build or rebuild from a tag.                                                                                          |

There is intentionally **no database/media backup cron** because there is no
database or hosted media to back up.

## Rollback procedures

### Source / repository

The pre-overhaul project is preserved on the **`main`** branch.

```bash
# Inspect what changed
git diff main..refactor/core-modernization --stat

# Roll a specific change back without losing history
git revert <commit>

# Hard reset a branch to the baseline (destructive)
git reset --hard main
```

### Frontend (low risk — stateless)

1. Identify the last good commit/tag.
2. `git revert` the offending change (or redeploy the previous build artifact).
3. Rebuild with correct env (`VITE_APTOS_MODULE_ADDRESS` must match the live
   module) and redeploy. Hosts like Netlify/Vercel/Cloudflare Pages also let you
   instant-rollback to a prior deployment.

### Smart contract (high care — on-chain)

A published Move module **cannot be deleted**. Recovery options:

1. **In-place upgrade** — if the package was published with a compatible
   `upgrade_policy`, publish a fixed version to the **same address** (layout
   must stay compatible). Verify with `aptos move test` first.
2. **Redeploy to a new address** — publish the fixed module under a new account,
   then point the frontend at it (`VITE_APTOS_MODULE_ADDRESS`) and redeploy the
   SPA. Existing tickets remain valid under the old collection.

> Because `init_module` creates the collection on publish, a fresh address
> starts a fresh collection — communicate this to users if you migrate.

## Incident playbook

| Symptom                               | Likely cause                                  | Action                                                               |
| ------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| App crashes on load with an env error | Missing/invalid `VITE_APTOS_*`                | Fix `.env.local` (see `.env.example`); the validator names the var.  |
| Every mint reverts                    | Wrong address/module name, or wrong network   | Confirm env matches the deployed module + `VITE_APTOS_NETWORK`.      |
| Mints time out / reads fail           | Fullnode/RPC outage                           | Switch network or configure an alternate fullnode in `lib/aptos.ts`. |
| "Wallet not found"                    | Petra not installed / not on the same network | Install Petra; switch its network to match.                          |
| CI red on contract job                | Framework `mainnet` branch moved              | Pin `Move.toml` `rev` to a known-good tag/commit, re-run.            |

## Manual verification checklist (post-deploy / post-rollback)

The wallet-signing path isn't covered by automated tests, so verify by hand:

1. `cd contracts && aptos move test` → 4/4 pass.
2. `cd web && npm run build` with production env → succeeds.
3. Load the app; connect Petra on the correct network.
4. Click **Book now**; approve in Petra.
5. Confirm the success status appears and the tx shows on the
   [Aptos explorer](https://explorer.aptoslabs.com/) for the buyer address.
6. Toggle light/dark; tab through with the keyboard (skip link → controls).
