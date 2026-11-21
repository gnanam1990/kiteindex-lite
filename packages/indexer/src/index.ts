import { ponder } from "ponder:registry";
import { block, transaction, addressStats } from "ponder:schema";

// Block-interval events only carry the block header, so fetch the full block
// (with transactions) through Ponder's cached RPC client.
ponder.on("KiteBlocks:block", async ({ event, context }) => {
  const { db, client } = context;
  const blk = await client.getBlock({
    blockNumber: event.block.number,
    includeTransactions: true,
  });

  await db
    .insert(block)
    .values({
      number: blk.number,
      hash: blk.hash,
      timestamp: blk.timestamp,
      tx_count: blk.transactions.length,
      gas_used: blk.gasUsed,
      miner: blk.miner,
    })
    .onConflictDoNothing();

  for (const tx of blk.transactions) {
    await db
      .insert(transaction)
      .values({
        hash: tx.hash,
        block_number: blk.number,
        block_timestamp: blk.timestamp,
        from_address: tx.from,
        to_address: tx.to ?? null,
        value_wei: tx.value,
        // Gas limit; the actual gas used needs a receipt per tx.
        gas_used: tx.gas,
        status: null,
        method_id: (tx.input?.slice(0, 10) ?? "0x") as `0x${string}`,
      })
      .onConflictDoNothing();

    await touchAddress(db, tx.from, blk.timestamp);
    if (tx.to) await touchAddress(db, tx.to, blk.timestamp);
  }
});

async function touchAddress(
  db: Parameters<Parameters<typeof ponder.on>[1]>[0]["context"]["db"],
  address: `0x${string}`,
  timestamp: bigint
) {
  await db
    .insert(addressStats)
    .values({ address, first_seen: timestamp, last_seen: timestamp, total_txs: 1 })
    .onConflictDoUpdate((row) => ({
      last_seen: timestamp > row.last_seen ? timestamp : row.last_seen,
      total_txs: row.total_txs + 1,
    }));
}
