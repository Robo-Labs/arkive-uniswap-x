import { formatUnits, PublicClient, Store } from '../deps.ts'

export const toNumber = (n: bigint, decimals: number) => {
  return parseFloat(formatUnits(n, decimals))
}

export const getBlock = async (
  client: PublicClient,
  store: Store,
  blockNumber: bigint,
) => {
  return await store.retrieve(
    `getBlock: ${Number(blockNumber)}`,
    async () => await client.getBlock({ blockNumber }),
  )
}

export const getChain = (client: PublicClient) => {
  switch (client.chain!.name) {
    case 'Arbitrum One':
      return 'arbitrum'
    case 'OP Mainnet':
      return 'optimism'
    default:
      return client.chain!.name.toLowerCase()
  }
}

export const sqrtPriceX96ToBigInt = (sqrtPrice: bigint, decimals: number) => {
    return parseFloat(formatUnits(sqrtPrice ** 2n, 0)) / ((2 ** 192) * (10 ** decimals))
}
