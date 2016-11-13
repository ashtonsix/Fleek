import {math, flow} from './operators'
import {number, id} from './symbols'

export const list = {
  operators: Object.values({...math, ...flow}),
  symbols: [number, id]
}
