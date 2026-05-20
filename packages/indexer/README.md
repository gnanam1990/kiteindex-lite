# `@kiteindex/indexer`

[Ponder](https://ponder.sh)-based indexer for Kite Mainnet. Writes blocks, transactions, and per-address aggregates into Postgres and exposes a GraphQL endpoint.

## Status

**Scaffolded, not deployed.** The config + schema + event handlers are written. To run, you need:

1. Postgres (Supabase free tier, Railway, or self-hosted).
2. A Kite Mainnet RPC URL — `https://rpc.gokite.ai` is fine for low traffic.
3. Node 20 + pnpm.

## Local dev (PGlite fallback)

```bash
pnpm install
pnpm dev
```

If `DATABASE_URL` is unset, Ponder uses [PGlite](https://pglite.dev) (embedded). Data is lost on restart but the dev loop works.

GraphQL endpoint: `http://localhost:42069/graphql`.

Smoke test:

```bash
curl -X POST http://localhost:42069/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ blocks(limit:1) { items { number } } }"}'
```

## Production

```bash
cp .env.example .env
# fill in PONDER_RPC_URL_2366 + DATABASE_URL
pnpm install
pnpm start
```

Put it behind a reverse proxy (Caddy / nginx) with TLS + IP rate limiting. The official Ponder Railway template is the path of least resistance.

## What's NOT here yet

- ERC-20 `Transfer` event log handlers (Ponder's `contracts:` block — add when you decide which tokens to index)
- Backfill from genesis (start with `latest` then expand)
- Custom GraphQL resolvers (the auto-generated ones are sufficient for v0.1)
