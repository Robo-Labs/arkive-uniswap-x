import { ERC20_ABI } from '../abis/erc20.ts'
import { Address, PublicClient, Store } from '../deps.ts'
import { Token } from '../entities/token.ts'

export const getToken = async (client: PublicClient, store: Store, address: Address) => {
  return await store.retrieve(`token:${client.chain?.id}:${address}`, async () => {
    // check if it's already in the db
    const record = await Token.findOne({ address })
    if (record) {
      return record
    }

    // edge-case MKR
    if (address.toLowerCase() === '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'.toLowerCase()) {
      return await Token.create({
        address: address.toLowerCase(),
        chain: client.chain?.name as string,
        decimals: 18,
        symbol: 'MKR',
      })      
    }
    // get the pair data.. todo, add symbol
    const abi = ERC20_ABI
    const [decimals, symbol] = await client.multicall({
      contracts: [
        { address, abi, functionName: 'decimals' },
        { address, abi, functionName: 'symbol' },
      ],
    })

    return await Token.create({
      address: address.toLowerCase(),
      chain: client.chain?.name as string,
      decimals: Number(decimals.result!),
      symbol: symbol.result!,
    })
  })
}
