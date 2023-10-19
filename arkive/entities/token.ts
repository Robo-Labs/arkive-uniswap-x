import { Address, createEntity } from '../deps.ts'

export interface IToken {
  address: Address
  chain: string
  decimals: number
  symbol: string
}

export const Token = createEntity<IToken>('Token', {
  address: String,
  chain: String,
  decimals: Number,
  symbol: String,
})
