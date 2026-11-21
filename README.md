# KiteIndex Lite

Free GraphQL API + playground for any data on the [Kite](https://gokite.ai) blockchain. Sister project to [AgentID](https://agentid-seven.vercel.app), [KiteLeaderboard](https://kiteleaderboard.vercel.app), and [KitePay](https://github.com/gnanam1990/kitepay).

A `pnpm` monorepo with two packages:

| Package                       | What it is                                                        | Status                  |
| ----------------------------- | ----------------------------------------------------------------- | ----------------------- |
| `packages/indexer`            | [Ponder](https://ponder.sh) indexer → Postgres → GraphQL endpoint | **Runs locally** — needs hosting |
| `packages/web`                | Vite + React playground (CodeMirror editor, preset queries)       | **Ships v0.1**          |

The playground works standalone with **mock mode** until you deploy the indexer.

## Live deployment

- Web playground: <https://kiteindex-lite.vercel.app>
- Host: Vercel (`kiteindex-lite`)
- Deployed package: `packages/web`
- Build: `pnpm build`
- Output: `dist`

The hosted playground is live but still in mock mode. The indexer now runs and serves live Kite Mainnet data locally (Ponder 0.15); it needs a Postgres-backed host, then set `VITE_GRAPHQL_ENDPOINT` on Vercel to its `/graphql` URL and redeploy.

## v0.1 scope

- **Playground UI** with GraphQL editor (CodeMirror), preset queries, table/JSON result viewer, curl/JS/TS snippet generator
- **Mock mode** so the UI is usable without a live indexer (returns sample data tagged with a PREVIEW banner)
- **Indexer scaffold**: `ponder.config.ts`, `ponder.schema.ts`, sample event handlers. You stand up Postgres, deploy, and set `VITE_GRAPHQL_ENDPOINT` in the web package.
- **No API keys, no auth.** Free, IP-rate-limited (do this at the reverse proxy when you deploy).

## Playground only (this session)

```bash
cd packages/web
pnpm install
pnpm dev   # http://localhost:3020
```

The playground will run in **mock mode** because there's no `VITE_GRAPHQL_ENDPOINT`. A banner says so loudly.

## Run the indexer (when you have Postgres)

```bash
cd packages/indexer
cp .env.example .env
# edit .env: PONDER_RPC_URL_2366 + DATABASE_URL
pnpm install
pnpm dev   # Ponder boots, GraphQL at http://localhost:42069/graphql (src/api/index.ts, CORS open)
```

Notes:

- The public Kite RPC (`rpc.gokite.ai`) disables `eth_getLogs`, which Ponder needs for live sync. `kite-transport.ts` answers those calls from `eth_getBlockReceipts`, so the public RPC works as-is.
- `ponder dev` exits when stdin closes; under a process manager use `ponder start` instead.
- On Windows, very long project paths break module resolution under pnpm (`ERR_REQUIRE_CYCLE_MODULE` from drizzle-orm). Clone to a short path.

Then in another terminal:

```bash
cd packages/web
VITE_GRAPHQL_ENDPOINT=http://localhost:42069/graphql pnpm dev
```

## Deploy

The indexer needs a server with Postgres and HTTP egress. Easiest:

- **Railway** — auto-provisions Postgres, deploys from GitHub. Set `PONDER_RPC_URL_2366` env var.
- **Hetzner CPX21** — `docker compose` with `postgres:16` + the indexer container behind Caddy.

The playground is static Vite output and is currently hosted on Vercel. Set `VITE_GRAPHQL_ENDPOINT` when a public indexer URL exists.

## Honest disclaimers

- v0.1 indexes from a starting block onward; **no historical backfill** until that's stable.
- Token transfers: only **Test USDT** indexed in v0.1 as a proof. Add more contracts as the schema matures.
- **No SLA.** Free, best-effort, may be rate-limited by Kite's RPC.

## Scope NOT in v0.1

- API keys / paid tiers
- Webhook subscriptions
- Full historical backfill
- Multi-token transfer indexing beyond Test USDT
- A published `@kiteindex/client` npm SDK
