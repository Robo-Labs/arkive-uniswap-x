import { createEntity } from 'https://deno.land/x/robo_arkiver@v0.4.22/mod.ts'
import { Address } from "../deps.ts";


export interface IOrder {
  block: number
  swapper: Address
  filler: Address
  in: {
    token: Address
    amount: number
  }
  out: {
    token: Address
    amount: number
  }
  startAsk: number
  endAsk: number
  price: number
  dutchRatio: number
  txHash: string
  createdAt: number
  type: string
  signature: string
  encodedOrder: string
}

export const Order = createEntity<IOrder>('Order', {
  block: Number,
  swapper: String,
  filler: String,
  in: {
    token: String,
    amount: Number,
  },
  out: {
    token: String,
    amount: Number,
  },
  startAsk: Number,
  endAsk: Number,
  price: Number,
  dutchRatio: { index: true, type: Number },
  txHash: String,
  createdAt: { index: true, type: Number },
  type: String,
  signature: String,
  encodedOrder: String,
})