import { Manifest } from 'https://deno.land/x/robo_arkiver@v0.4.22/mod.ts'
import { Order } from './entities/fill.ts'
import { DUTCH_ORDER_REACTOR_ABI } from "./abis/dutchOrderReactorAbi.ts";
import { onFill } from "./handlers/fill.ts";
import { Token } from "./entities/token.ts";

const manifest = new Manifest('univswap-x')

manifest
  .addEntities([Order, Token])
  .addChain('mainnet', (chain) =>
    chain
      .addContract({
        abi: DUTCH_ORDER_REACTOR_ABI,
        name: 'Erc20',
        sources: { '0x6000da47483062A0D734Ba3dc7576Ce6A0B645C4': 17777988n },
        eventHandlers: { 'Fill': onFill },
      }))

export default manifest.build()
