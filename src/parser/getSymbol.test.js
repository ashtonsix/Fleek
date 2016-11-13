import getSymbol from './getSymbol'
import {list} from '../syntax/contexts'

describe('simpleExpression', () => {
  const program = 'let number <- 5 + 6'
  it('should parse entire expression correctly', () => {
    let i = 0, symbol
    [i, symbol] = getSymbol(program, i, list)
    expect(symbol.type).toBe('id')
    expect(symbol.value).toBe('let');
    [i, symbol] = getSymbol(program, i, list)
    expect(symbol.type).toBe('id')
    expect(symbol.value).toBe('number');
    [i, symbol] = getSymbol(program, i, list)
    expect(symbol.type).toBe('op')
    expect(symbol.value).toBe('<-');
    [i, symbol] = getSymbol(program, i, list)
    expect(symbol.type).toBe('number')
    expect(symbol.value).toBe('5');
    [i, symbol] = getSymbol(program, i, list)
    expect(symbol.type).toBe('op')
    expect(symbol.value).toBe('+');
    [i, symbol] = getSymbol(program, i, list)
    expect(symbol.type).toBe('number')
    expect(symbol.value).toBe('6');
  })
})
