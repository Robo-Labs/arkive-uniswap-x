import { type EventHandlerFor } from 'https://deno.land/x/robo_arkiver@v0.4.22/mod.ts'
import { DUTCH_ORDER_REACTOR_ABI } from "../abis/dutchOrderReactorAbi.ts";
import { UniswapX } from "../utils/uniswapx.ts";
import { Order } from "../entities/fill.ts";

export const onFill: EventHandlerFor<typeof DUTCH_ORDER_REACTOR_ABI, 'Fill'> = async (
  { event, client, store },
) => {
  const { filler, nonce, orderHash, swapper } = event.args
  const order = await UniswapX.getOrders({ orderHash })
  if (Array.isArray(order)) {
    console.log('Cannot find order for hash', orderHash)
    return
  }

  const decoded = await UniswapX.decodeOrder(client, store, order as any)
  // console.log(decoded)
  await Order.create({
    ...decoded,
    block: Number(event.blockNumber),
    filler,
    swapper,
    nonce,
  })


  
}