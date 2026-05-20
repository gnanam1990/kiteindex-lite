export interface PresetQuery {
  id: string;
  title: string;
  description: string;
  query: string;
  variables?: Record<string, unknown>;
  preview?: boolean;
}

export const PRESET_QUERIES: PresetQuery[] = [
  {
    id: "blocks-latest",
    title: "Latest blocks",
    description: "Most recent blocks on Kite Mainnet",
    query: `query LatestBlocks {
  blocks(orderBy: "number", orderDirection: "desc", limit: 10) {
    items {
      number
      hash
      timestamp
      tx_count
      gas_used
    }
  }
}`,
  },
  {
    id: "recent-txs",
    title: "Recent transactions",
    description: "Last 25 transactions on Kite Mainnet, newest first",
    query: `query RecentTxs {
  transactions(orderBy: "block_timestamp", orderDirection: "desc", limit: 25) {
    items {
      hash
      from_address
      to_address
      value_wei
      block_number
      block_timestamp
    }
  }
}`,
  },
  {
    id: "address-activity",
    title: "Address activity timeline",
    description: "All transactions involving a specific address, newest first",
    query: `query AddressActivity($address: String!) {
  transactions(
    where: { OR: [{ from_address: $address }, { to_address: $address }] }
    orderBy: "block_timestamp"
    orderDirection: "desc"
    limit: 50
  ) {
    items {
      hash
      from_address
      to_address
      value_wei
      block_timestamp
    }
  }
}`,
    variables: { address: "0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043" },
  },
  {
    id: "top-addresses-by-tx-count",
    title: "Most active addresses",
    description: "Top 10 addresses by lifetime tx count",
    query: `query TopActive {
  addressStatss(orderBy: "total_txs", orderDirection: "desc", limit: 10) {
    items {
      address
      total_txs
      first_seen
      last_seen
    }
  }
}`,
  },
  {
    id: "token-transfers-recent",
    title: "Recent token transfers",
    description: "Last 25 ERC-20 transfers — only Test USDT indexed in v0.1",
    preview: true,
    query: `query RecentTokenTransfers {
  tokenTransfers(orderBy: "block_timestamp", orderDirection: "desc", limit: 25) {
    items {
      token_address
      from_address
      to_address
      amount
      block_timestamp
    }
  }
}`,
  },
];

export function findPreset(id: string): PresetQuery | null {
  return PRESET_QUERIES.find((q) => q.id === id) ?? null;
}
