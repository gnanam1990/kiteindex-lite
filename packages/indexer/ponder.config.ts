import { createConfig } from "ponder";
import { kiteTransport } from "./kite-transport";

// Unset → start at the chain head. Kite Mainnet has millions of blocks, so a
// full backfill from genesis takes a long time; pick a recent block instead.
const START_BLOCK = process.env.PONDER_START_BLOCK
  ? Number(process.env.PONDER_START_BLOCK)
  : "latest";

export default createConfig({
  chains: {
    kite: {
      id: 2366,
      rpc: kiteTransport(process.env.PONDER_RPC_URL_2366 ?? "https://rpc.gokite.ai"),
      pollingInterval: 2_000,
      // eth_getLogs is emulated per block (see kite-transport.ts), so keep ranges small.
      ethGetLogsBlockRange: 100,
    },
  },
  blocks: {
    KiteBlocks: {
      chain: "kite",
      interval: 1,
      startBlock: START_BLOCK,
    },
  },
});
