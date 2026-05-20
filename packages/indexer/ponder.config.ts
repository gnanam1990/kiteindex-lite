import { createConfig } from "ponder";
import { http } from "viem";

const START_BLOCK = process.env.PONDER_START_BLOCK
  ? Number(process.env.PONDER_START_BLOCK)
  : "latest";

export default createConfig({
  networks: {
    kite: {
      chainId: 2366,
      transport: http(process.env.PONDER_RPC_URL_2366 ?? "https://rpc.gokite.ai"),
      pollingInterval: 2_000,
    },
  },
  blocks: {
    KiteBlocks: {
      network: "kite",
      interval: 1,
      startBlock: START_BLOCK as number | "latest",
    },
  },
});
