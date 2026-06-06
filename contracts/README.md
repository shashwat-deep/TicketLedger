# TicketLedger — Move package

Aptos Move package implementing event tickets as **Digital Assets**.
Module: `ticketledger::ticket_nft`.

```bash
aptos move test              # run unit tests (4)
aptos move compile           # compile only
aptos move publish --named-addresses ticketledger=<your-address>
```

- `init_module` creates the shared `TicketLedger Events` collection on publish.
- `mint_ticket(buyer, name, description, uri)` mints a ticket NFT to the buyer.
- `#[view]`s: `is_initialized`, `collection_name`, `creator_object_address`.

`build/` and `.aptos/` are generated and gitignored. See
[../ARCHITECTURE.md](../ARCHITECTURE.md) for the object-capability design.
