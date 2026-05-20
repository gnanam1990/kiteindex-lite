import { onchainTable, index } from "ponder";

export const block = onchainTable("block", (t) => ({
  number: t.bigint().primaryKey(),
  hash: t.hex().notNull(),
  timestamp: t.bigint().notNull(),
  tx_count: t.integer().notNull(),
  gas_used: t.bigint().notNull(),
  miner: t.hex(),
}));

export const transaction = onchainTable(
  "transaction",
  (t) => ({
    hash: t.hex().primaryKey(),
    block_number: t.bigint().notNull(),
    block_timestamp: t.bigint().notNull(),
    from_address: t.hex().notNull(),
    to_address: t.hex(),
    value_wei: t.bigint().notNull(),
    gas_used: t.bigint(),
    status: t.text(),
    method_id: t.hex(),
  }),
  (t) => ({
    fromIdx: index().on(t.from_address),
    toIdx: index().on(t.to_address),
    blockIdx: index().on(t.block_timestamp),
  })
);

export const tokenTransfer = onchainTable(
  "token_transfer",
  (t) => ({
    id: t.text().primaryKey(),
    tx_hash: t.hex().notNull(),
    block_number: t.bigint().notNull(),
    block_timestamp: t.bigint().notNull(),
    token_address: t.hex().notNull(),
    from_address: t.hex().notNull(),
    to_address: t.hex().notNull(),
    amount: t.bigint().notNull(),
  }),
  (t) => ({
    tokenIdx: index().on(t.token_address),
    fromIdx: index().on(t.from_address),
    toIdx: index().on(t.to_address),
  })
);

export const addressStats = onchainTable("address_stats", (t) => ({
  address: t.hex().primaryKey(),
  first_seen: t.bigint().notNull(),
  last_seen: t.bigint().notNull(),
  total_txs: t.integer().notNull(),
}));
