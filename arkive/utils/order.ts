import { z } from 'npm:zod'

export const OrderSchema = z.object({
  outputs: z.array(z.object({
    recipient: z.string(),
    startAmount: z.string(),
    endAmount: z.string(),
    token: z.string(),
  })),
  encodedOrder: z.string(),
  signature: z.string(),
  input: z.object({
    endAmount: z.string(),
    token: z.string(),
    startAmount: z.string(),
  }),
  settledAmounts: z.array(z.object({
    tokenOut: z.string(),
    amountOut: z.string(),
  })),
  orderStatus: z.string(),
  txHash: z.string().optional(),
  createdAt: z.number(),
  chainId: z.number(),
  orderHash: z.string(),
  type: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;