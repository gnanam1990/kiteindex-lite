# KiteIndex Lite

> Free, no-auth GraphQL API and query playground for on-chain data from the Kite Mainnet.

## Overview

KiteIndex Lite is a `pnpm` monorepo that pairs a [Ponder](https://ponder.sh) indexer with a browser playground for querying Kite Mainnet (chain ID `2366`) data over GraphQL. The indexer ingests blocks, transactions, and per-address aggregates into Postgres and serves an auto-generated GraphQL endpoint; the playground lets you explore that schema, run preset or custom queries, and copy ready-to-paste request snippets. The playground also ships a built-in mock mode so the UI is fully usable before any indexer is deployed.

## Features

- GraphQL playground with a CodeMirror query editor, table/JSON result viewer, and request timing.
- Preset queries for latest blocks, recent transactions, address activity timelines, and most-active addresses.
- Snippet generator that produces working `curl`, JavaScript `fetch`, and TypeScript (`graphql-request`) calls for the current query.
- Schema sidebar showing a snapshot of the indexed tables and fields, with click-to-insert field references.
- Mock mode: when no GraphQL endpoint is configured, preset queries return canned sample data behind a clear preview banner so the UI works standalone.
- Ponder indexer for Kite Mainnet that records blocks, transactions, and per-address statistics (first seen, last seen, total tx count).
- No API keys and no auth by design — intended to be rate-limited at the reverse proxy when deployed.

## Tech stack

- **Indexer:** TypeScript, Ponder, viem, Hono; Postgres (or embedded PGlite in dev); GraphQL.
- **Web:** TypeScript, React, Vite, Tailwind CSS, CodeMirror (`@uiw/react-codemirror`), lucide-react, viem.
- **Tooling:** pnpm workspaces, ESLint, `tsc` type-checking.

## Architecture

| Package            | What it is                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `packages/indexer` | Ponder indexer for Kite Mainnet → Postgres → auto-generated GraphQL endpoint.               |
| `packages/web`     | Vite + React playground for exploring the schema and running GraphQL queries against it.    |

The indexer writes into four tables defined in `ponder.schema.ts` — `block`, `transaction`, `token_transfer`, and `address_stats` — and Ponder exposes them as a GraphQL API (default `http://localhost:42069/graphql`). The web app reads `VITE_GRAPHQL_ENDPOINT` to talk to that API; when the variable is unset it falls back to mock mode.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- A Kite Mainnet RPC URL (e.g. `https://rpc.gokite.ai`) — only needed to run the indexer.
- Postgres — only needed to run the indexer with persistence (dev falls back to embedded PGlite).

### Installation

```bash
pnpm install
```

### Configuration

The indexer (`packages/indexer`) reads:

| Variable               | Required | Purpose                                                                                  |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `PONDER_RPC_URL_2366`  | yes      | RPC endpoint for Kite Mainnet (chain `2366`). Defaults to `https://rpc.gokite.ai`.       |
| `DATABASE_URL`         | no       | Postgres connection string. If unset, Ponder uses embedded PGlite (data lost on restart).|
| `PONDER_START_BLOCK`   | no       | Block number to start indexing from. If unset, indexing starts at `latest`.              |

Copy `packages/indexer/.env.example` to `packages/indexer/.env` and fill in the values.

The web app (`packages/web`) reads:

| Variable                 | Required | Purpose                                                                            |
| ------------------------ | -------- | ---------------------------------------------------------------------------------- |
| `VITE_GRAPHQL_ENDPOINT`  | no       | GraphQL endpoint to query. If unset, the playground runs in mock mode.             |
| `DISABLE_HMR`            | no       | Set to `true` to disable Vite hot-module reload during dev.                        |

### Running

Run the playground on its own (mock mode, no indexer required):

```bash
pnpm dev:web        # http://localhost:3020
```

Run the indexer:

```bash
cd packages/indexer
cp .env.example .env   # set PONDER_RPC_URL_2366 (and optionally DATABASE_URL)
pnpm codegen           # generate Ponder types
pnpm dev               # Ponder boots, GraphQL at http://localhost:42069/graphql
```

From the repo root these are also available as `pnpm dev:indexer` and `pnpm build:web`. To point the playground at a running indexer:

```bash
cd packages/web
VITE_GRAPHQL_ENDPOINT=http://localhost:42069/graphql pnpm dev
```

## Usage

The playground (`/playground`) offers preset queries you can run directly, or you can write your own GraphQL against the indexed schema. Example query for the latest blocks:

```graphql
query LatestBlocks {
  blocks(orderBy: "number", orderDirection: "desc", limit: 10) {
    items {
      number
      hash
      timestamp
      tx_count
      gas_used
    }
  }
}
```

Smoke-test a running indexer directly:

```bash
curl -X POST http://localhost:42069/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ blocks(limit:1) { items { number } } }"}'
```

## Project structure

```
.
├── packages/
│   ├── indexer/        # Ponder indexer (ponder.config.ts, ponder.schema.ts, src/index.ts)
│   └── web/            # Vite + React playground
├── package.json        # workspace scripts (dev:web, dev:indexer, build:web, lint)
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

## Status

Early v0.1, mixed maturity:

- **Web playground:** functional. Runs standalone in mock mode (preset queries return sample data with a preview banner) and against a live endpoint when `VITE_GRAPHQL_ENDPOINT` is set. The deploy target is `https://kiteindex-lite.vercel.app` (static Vite build, output `dist`).
- **Indexer:** scaffolded but not deployed. The Ponder config, schema, and block/transaction/address-stats handlers are written and run locally, but there is no production Postgres-backed deployment yet.
- **Token transfers:** the `token_transfer` table and a corresponding preset query exist, but **no ERC-20 `Transfer` event handler is implemented yet**, so that table is not populated. This is on the roadmap.
- **Schema sidebar:** shows a static snapshot of `ponder.schema.ts`; live GraphQL introspection is planned for a later release.

Not in v0.1: API keys / paid tiers, webhook subscriptions, full historical backfill, multi-token transfer indexing, and a published client SDK. There is no SLA — the service is best-effort and may be rate-limited by the upstream RPC.

## License

No license specified.
