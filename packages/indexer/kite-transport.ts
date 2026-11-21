import { custom, type Transport } from "viem";

/**
 * The public Kite RPC (rpc.gokite.ai) rejects every `eth_getLogs` call with
 * -32601, but Ponder needs it for live indexing. `eth_getBlockReceipts` works,
 * so this transport answers `eth_getLogs` from block receipts and forwards
 * everything else unchanged.
 */

type Hex = `0x${string}`;
type LogFilter = {
  blockHash?: Hex;
  fromBlock?: Hex | string;
  toBlock?: Hex | string;
  address?: Hex | Hex[] | null;
  topics?: (Hex | Hex[] | null)[];
};
type Log = { address: Hex; topics: Hex[]; [k: string]: unknown };

// Range queries are emulated one block at a time, so keep them bounded.
const MAX_RANGE = 200;

export function kiteTransport(url: string): Transport {
  let id = 0;

  async function rpc(method: string, params: unknown[] = []): Promise<any> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url} (${method})`);
    const json = (await res.json()) as { result?: unknown; error?: { code: number; message: string } };
    if (json.error) {
      const err = new Error(json.error.message) as Error & { code: number };
      err.code = json.error.code;
      throw err;
    }
    return json.result;
  }

  async function logsForBlock(block: Hex | string): Promise<Log[]> {
    const receipts = (await rpc("eth_getBlockReceipts", [block])) as { logs: Log[] }[] | null;
    return (receipts ?? []).flatMap((r) => r.logs);
  }

  async function toNumber(tag: Hex | string | undefined): Promise<bigint> {
    if (!tag || tag === "latest" || tag === "safe" || tag === "finalized" || tag === "pending") {
      return BigInt((await rpc("eth_blockNumber")) as Hex);
    }
    if (tag === "earliest") return 0n;
    return BigInt(tag);
  }

  async function getLogs(filter: LogFilter): Promise<Log[]> {
    let logs: Log[] = [];
    if (filter.blockHash) {
      logs = await logsForBlock(filter.blockHash);
    } else {
      const from = await toNumber(filter.fromBlock);
      const to = await toNumber(filter.toBlock ?? "latest");
      if (to - from + 1n > BigInt(MAX_RANGE)) {
        const err = new Error(
          `eth_getLogs emulation: block range too large (max ${MAX_RANGE})`
        ) as Error & { code: number };
        err.code = -32005;
        throw err;
      }
      for (let n = from; n <= to; n++) {
        logs.push(...(await logsForBlock(`0x${n.toString(16)}`)));
      }
    }
    return logs.filter((log) => matches(log, filter));
  }

  return custom({
    async request({ method, params }) {
      if (method === "eth_getLogs") {
        return getLogs((params as [LogFilter])[0]);
      }
      return rpc(method, params as unknown[]);
    },
  });
}

function matches(log: Log, filter: LogFilter): boolean {
  if (filter.address) {
    const wanted = (Array.isArray(filter.address) ? filter.address : [filter.address]).map((a) =>
      a.toLowerCase()
    );
    if (!wanted.includes(log.address.toLowerCase())) return false;
  }
  for (const [i, topic] of (filter.topics ?? []).entries()) {
    if (topic === null || topic === undefined) continue;
    const actual = log.topics[i]?.toLowerCase();
    const options = (Array.isArray(topic) ? topic : [topic]).map((t) => t.toLowerCase());
    if (!actual || !options.includes(actual)) return false;
  }
  return true;
}
