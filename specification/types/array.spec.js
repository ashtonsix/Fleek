const fleek = jest.fn()

describe('creation', () => {
  it('should create an array', () => {
    const program = '[1 4]'
    expect(fleek(program)).toEqual('[1 4]')
  })
  it('should create a multi-dimensional array', () => {
    let program = '[1 4; 2 8]'
    expect(fleek(program)).toEqual('[1 4; 2 8]')
    program = '[[1 4] [2 8]]'
    expect(fleek(program)).toEqual('[1 4; 2 8]')
  })
  it('shouldn\'t allow operators inside arrays', () => {
    const program = '[1 2 + 3]'
    expect(() => fleek(program)).toThrow()
  })
  it('should evaluate lists inside arrays', () => {
    const program = '[1 (2 + 3)]'
    expect(fleek(program)).toEqual('[1 5]')
  })
})
