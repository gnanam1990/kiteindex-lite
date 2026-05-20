import { ponder } from "ponder:registry";
import { block, transaction, addressStats } from "ponder:schema";

ponder.on("KiteBlocks:block", async ({ event, context }) => {
  const { db } = context;
  const blk = event.block;

  await db.insert(block).values({
    number: blk.number,
    hash: blk.hash,
    timestamp: blk.timestamp,
    tx_count: blk.transactions.length,
    gas_used: blk.gasUsed,
    miner: blk.miner,
  });

  for (const tx of blk.transactions) {
    await db.insert(transaction).values({
      hash: tx.hash,
      block_number: blk.number,
      block_timestamp: blk.timestamp,
      from_address: tx.from,
      to_address: tx.to ?? null,
      value_wei: tx.value,
      gas_used: tx.gas,
      status: "ok",
      method_id: (tx.input?.slice(0, 10) ?? "0x") as `0x${string}`,
    });

    await upsertAddressStats(db, tx.from, blk.timestamp);
    if (tx.to) await upsertAddressStats(db, tx.to, blk.timestamp);
  }
});

async function upsertAddressStats(
  db: any,
  address: `0x${string}`,
  timestamp: bigint
) {
  const existing = await db.find(addressStats, { address });
  if (!existing) {
    await db.insert(addressStats).values({
      address,
      first_seen: timestamp,
      last_seen: timestamp,
      total_txs: 1,
    });
  } else {
    await db
      .update(addressStats, { address })
      .set({ last_seen: timestamp, total_txs: existing.total_txs + 1 });
  }
}
