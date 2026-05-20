// Hardcoded snapshot of the GraphQL schema mirrors packages/indexer/ponder.schema.ts.
// v0.2 should introspect the live endpoint instead.

export interface SchemaField {
  name: string;
  type: string;
  description?: string;
}

export interface SchemaType {
  name: string;
  description: string;
  fields: SchemaField[];
}

export const SCHEMA: SchemaType[] = [
  {
    name: "Block",
    description: "A block on Kite Mainnet",
    fields: [
      { name: "number", type: "BigInt!", description: "Block height" },
      { name: "hash", type: "Hex!" },
      { name: "timestamp", type: "BigInt!", description: "Unix seconds" },
      { name: "tx_count", type: "Int!" },
      { name: "gas_used", type: "BigInt!" },
      { name: "miner", type: "Hex" },
    ],
  },
  {
    name: "Transaction",
    description: "A transaction included on Kite",
    fields: [
      { name: "hash", type: "Hex!" },
      { name: "block_number", type: "BigInt!" },
      { name: "block_timestamp", type: "BigInt!" },
      { name: "from_address", type: "Hex!" },
      { name: "to_address", type: "Hex" },
      { name: "value_wei", type: "BigInt!" },
      { name: "gas_used", type: "BigInt" },
      { name: "status", type: "String" },
      { name: "method_id", type: "Hex", description: "First 4 bytes of input data" },
    ],
  },
  {
    name: "TokenTransfer",
    description: "An ERC-20 Transfer event (only Test USDT indexed in v0.1)",
    fields: [
      { name: "id", type: "String!", description: "tx_hash + log_index" },
      { name: "tx_hash", type: "Hex!" },
      { name: "block_number", type: "BigInt!" },
      { name: "block_timestamp", type: "BigInt!" },
      { name: "token_address", type: "Hex!" },
      { name: "from_address", type: "Hex!" },
      { name: "to_address", type: "Hex!" },
      { name: "amount", type: "BigInt!" },
    ],
  },
  {
    name: "AddressStats",
    description: "Aggregated stats for a single address",
    fields: [
      { name: "address", type: "Hex!" },
      { name: "first_seen", type: "BigInt!" },
      { name: "last_seen", type: "BigInt!" },
      { name: "total_txs", type: "Int!" },
    ],
  },
];
