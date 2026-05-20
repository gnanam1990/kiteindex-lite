# KiteIndex Lite

Free GraphQL API + playground for any data on the [Kite](https://gokite.ai) blockchain. Sister project to [AgentID](https://agentid-seven.vercel.app), [KiteLeaderboard](https://kiteleaderboard.vercel.app), and [KitePay](https://github.com/gnanam1990/kitepay).

A `pnpm` monorepo with two packages:

| Package                       | What it is                                                        | Status                  |
| ----------------------------- | ----------------------------------------------------------------- | ----------------------- |
| `packages/indexer`            | [Ponder](https://ponder.sh) indexer → Postgres → GraphQL endpoint | **Scaffolded** — needs deploy |
| `packages/web`                | Vite + React playground (CodeMirror editor, preset queries)       | **Ships v0.1**          |

The playground works standalone with **mock mode** until you deploy the indexer.

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
pnpm dev   # Ponder boots, auto-exposes GraphQL at http://localhost:42069/graphql
```

Then in another terminal:

```bash
cd packages/web
VITE_GRAPHQL_ENDPOINT=http://localhost:42069/graphql pnpm dev
```

## Deploy

The indexer needs a server with Postgres and HTTP egress. Easiest:

- **Railway** — auto-provisions Postgres, deploys from GitHub. Set `PONDER_RPC_URL_2366` env var.
- **Hetzner CPX21** — `docker compose` with `postgres:16` + the indexer container behind Caddy.

The playground is static Vite output — deploy to Vercel/Netlify with `VITE_GRAPHQL_ENDPOINT` pointing at the indexer's public URL.

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
