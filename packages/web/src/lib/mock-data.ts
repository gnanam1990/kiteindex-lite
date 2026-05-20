// Sample responses for the playground when no live indexer is configured.
// These match the schema in packages/indexer/ponder.schema.ts so the result viewer behaves the same way.

export const MOCK_RESPONSES: Record<string, unknown> = {
  "recent-txs": {
    transactions: {
      items: [
        {
          hash: "0x4b8e5fd2a91c3a4b8c7d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
          from_address: "0x7d627b0F5Ec62155db013B8E7d1Ca9bA53218E82",
          to_address: "0xd26850d11e8412fC6035750BE6A871dff9091FAe",
          value_wei: "1500000000000000000",
          block_number: "89540",
          block_timestamp: "1747740100",
        },
        {
          hash: "0xa7f2c41e3b5d8c4a9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
          from_address: "0xd26850d11e8412fC6035750BE6A871dff9091FAe",
          to_address: "0x7d627b0F5Ec62155db013B8E7d1Ca9bA53218E82",
          value_wei: "250000000000000000",
          block_number: "89539",
          block_timestamp: "1747740045",
        },
        {
          hash: "0x9c1e2a3f4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
          from_address: "0x03a67e5600f807E3565984b7d2c77b893cC17181",
          to_address: "0xfB971C3200c3DB4Ef23F991D2d1F0D329A1Bf036",
          value_wei: "0",
          block_number: "89538",
          block_timestamp: "1747739982",
        },
      ],
    },
  },
  "address-activity": {
    transactions: {
      items: [
        {
          hash: "0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
          from_address: "0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043",
          to_address: "0x7d627b0F5Ec62155db013B8E7d1Ca9bA53218E82",
          value_wei: "500000000000000000",
          block_timestamp: "1747740050",
        },
        {
          hash: "0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
          from_address: "0xfB971C3200c3DB4Ef23F991D2d1F0D329A1Bf036",
          to_address: "0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043",
          value_wei: "1000000000000000000",
          block_timestamp: "1747738900",
        },
      ],
    },
  },
  "top-addresses-by-tx-count": {
    addressStatss: {
      items: [
        {
          address: "0x7d627b0F5Ec62155db013B8E7d1Ca9bA53218E82",
          total_txs: 487,
          first_seen: "1747001200",
          last_seen: "1747740100",
        },
        {
          address: "0xd26850d11e8412fC6035750BE6A871dff9091FAe",
          total_txs: 312,
          first_seen: "1747100400",
          last_seen: "1747740045",
        },
        {
          address: "0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043",
          total_txs: 198,
          first_seen: "1747204800",
          last_seen: "1747740050",
        },
      ],
    },
  },
  "token-transfers-recent": {
    tokenTransfers: {
      items: [
        {
          token_address: "0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63",
          from_address: "0x25b2999Fa3C29cFc5A59939d5cbBB70DDF7B3D76",
          to_address: "0x03a67e5600f807E3565984b7d2c77b893cC17181",
          amount: "10000000000000000000",
          block_timestamp: "1747739900",
        },
      ],
    },
  },
  "blocks-latest": {
    blocks: {
      items: [
        {
          number: "89540",
          hash: "0xaabbccddeeff0011223344556677889900aabbccddeeff00112233445566778899",
          timestamp: "1747740100",
          tx_count: 7,
          gas_used: "2145000",
        },
        {
          number: "89539",
          hash: "0xddeeff00112233445566778899aabbccddeeff00112233445566778899aabbcc",
          timestamp: "1747740045",
          tx_count: 4,
          gas_used: "1280000",
        },
      ],
    },
  },
};
