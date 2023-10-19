import { Address, PublicClient, Store } from "../deps.ts";
import { Order, OrderSchema } from "./order.ts"
import { getToken } from "./token.ts";
import { toNumber } from "./util.ts";

export class UniswapX {
  static async getOrders(options: { chainId?: number, orderStatus?: string, orderHash?: string }) {
    const get = async () => {
      const url = new URL('https://api.uniswap.org/v2/orders')
      
      // setup query params
      url.searchParams.append('chainId', options.chainId?.toString() || '1')
      if (options.orderStatus)
        url.searchParams.append('orderStatus', options.orderStatus)
      if (options.orderHash)
        url.searchParams.append('orderHash', options.orderHash)

      // Make request
      const resp = await fetch(url)
      const { orders, errorCode } = await resp.json()
      if (errorCode) throw new Error(errorCode)
      const formatted = orders.map((e: unknown) => this.parse(e)) as Order[]
      return formatted.length === 1 ? formatted[0] : formatted
    }

    let retry = 0
    while(retry < 100) {
      try {
        return await get()
      } catch(e) {
        console.log(`uniswapx rate limit reached. Retrying in 10s. # of attempts: ${retry}`)
        retry++
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    }
    throw Error(`Failed to fetch orders after ${retry} retries`)
  }

  static parse(raw: unknown) {
    return OrderSchema.parse(raw)
  }

  static async decodeOrder(client: PublicClient, store: Store, order: Order) {
    const { createdAt, type, signature, encodedOrder, input, outputs, settledAmounts } = order
    if (!input)
      console.log(order)
    const [tokenIn, tokenOut] = await Promise.all([
      getToken(client, store, input.token as Address),
      getToken(client, store, outputs[0].token as Address)
    ])
    const tokensIn = toNumber(BigInt(input.startAmount), tokenIn.decimals)
    const tokensOut = toNumber(BigInt(settledAmounts[0].amountOut), tokenOut.decimals)
    const startAsk = toNumber(BigInt(outputs[0].startAmount), tokenOut.decimals) / tokensIn
    const endAsk = toNumber(BigInt(outputs[0].endAmount), tokenOut.decimals) / tokensIn
    const diff = endAsk - startAsk
    const price = tokensOut / tokensIn
    return {
      in: {
        token: tokenIn.symbol,
        amount: tokensIn,
      },
      out: {
        token: tokenOut.symbol,
        amount: tokensOut,
      },
      startAsk: startAsk,
      endAsk: endAsk,
      price,
      dutchRatio: (price - startAsk) / diff, // 0 is best price, 1 is worst price
      txHash: order.txHash,
      createdAt,
      type,
      signature,
      encodedOrder,
    }
  }
}