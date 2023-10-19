// url_test.ts
import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { UniswapX } from "../utils/uniswapx.ts";
import { DUTCH_FILLED_ORDER } from "./dutch-filled-orders.ts";
import { createPublicClient } from "npm:viem";
import { mainnet } from "npm:viem/chains";
import { http } from "npm:viem";
import { default as mongoose } from 'npm:mongoose@7.5.0'
import { Store } from "../deps.ts";

const connectionString = 'mongodb://root:example@localhost:27017'
await mongoose.connect(connectionString, {
  dbName: '0-0',
} as any)
const store = new Store({
  max: 1000,
})
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})


// Deno.test("uniswapx decoded filled order", async () => {
//   const decoded = await UniswapX.decodeOrder(client, store, DUTCH_FILLED_ORDER as any)
//   console.log(decoded)
// });

Deno.test("uniswapx fetch and decode order", async () => {
  const order = await UniswapX.getOrders({ orderHash: '0x679fb228efdc7f08e6000839245cc173082c1f189d3191baca4d91c3d940dd12' })
  const decoded = await UniswapX.decodeOrder(client, store, order as any)
  console.log(decoded)
});