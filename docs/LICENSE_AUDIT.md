# Dependency License Audit

Generated with `license-checker-rseidelsohn` against the installed dependency
tree (web client). Re-run with:

```bash
cd web && npx license-checker-rseidelsohn --summary            # all
cd web && npx license-checker-rseidelsohn --production --summary # shipping only
```

## Summary

**No GPL / LGPL / AGPL (strong copyleft) dependencies are present.** Everything
that ships to users is permissively licensed.

### Production (shipped to the browser)

| License      | Packages |
| ------------ | -------- |
| MIT          | 186      |
| Apache-2.0   | 24       |
| ISC          | 9        |
| Unlicense    | 3        |
| BSD-3-Clause | 2        |
| MPL-2.0      | 2        |
| BSD-2-Clause | 1        |
| Zlib         | 1        |
| UNKNOWN      | 1        |
| UNLICENSED   | 1        |

### All dependencies (incl. dev)

MIT 484 · Apache-2.0 45 · ISC 22 · BSD-2 10 · BSD-3 8 · MPL-2.0 5 · Unlicense 3
· MIT-0 2 · CC0-1.0 2 · BlueOak-1.0.0 2 · Python-2.0 1 · CC-BY-4.0 1 · Zlib 1 ·
UNKNOWN 1 · UNLICENSED 1.

## Items reviewed individually

| Package                                | License    | Assessment                                                                                                               |
| -------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ticketledger-web` (this app)          | UNLICENSED | **Not a risk** — our own `private: true` package with no `license` field. The repo is MIT.                               |
| `@atomrigslab/aptos-wallet-adapter`    | UNKNOWN    | Transitive (wallet-adapter ecosystem); declares no license. **Action:** verify upstream or avoid relying on it directly. |
| `axe-core`                             | MPL-2.0    | Weak/file-level copyleft. Dev-only; used unmodified → no source-disclosure obligation.                                   |
| `lightningcss`, `lightningcss-linux-*` | MPL-2.0    | Build tooling, used unmodified → compliant.                                                                              |
| `webextension-polyfill`                | MPL-2.0    | Transitive (wallet). Used unmodified → compliant.                                                                        |

## Conclusion

- ✅ No copyleft (GPL family) license obligations on our code.
- ✅ MPL-2.0 dependencies are used as unmodified libraries — only modifications
  to _their own files_ would trigger disclosure, which we do not make.
- ⚠️ One transitive dependency (`@atomrigslab/aptos-wallet-adapter`) ships
  without a declared license — track it and confirm intent upstream.
- ℹ️ The lone `UNLICENSED` entry is this project's own private package.

> Consider adding an automated license gate to CI (e.g.
> `license-checker-rseidelsohn --failOn 'GPL;AGPL;LGPL'`) to prevent regressions.
