const fleek = jest.fn()

describe('creation', () => {
  it('should create an identity', () => {
    const program = `let value <- 6`
    expect(fleek(program)).toEqual(`@value`)
  })
  describe('type', () => {
    it('should create a Number', () => {
      const program = `(let value <- 6, return <- @value.type)`
      expect(fleek(program)).toEqual(`'Number'`)
    })
    it('should create a String', () => {
      const program = `(let value <- 'Hello world!', return <- @value.type)`
      expect(fleek(program)).toEqual(`'String'`)
    })
    it('should create an Array', () => {
      const program = `(let value <- [5], return <- @value.type)`
      expect(fleek(program)).toEqual(`'Array'`)
    })
    it('should create a Map', () => {
      const program = `(let value <- {key: 'value'}, return <- @value.type)`
      expect(fleek(program)).toEqual(`'Map'`)
    })
  })
  describe('value', () => {
    it('should have the correct value', () => {
      const program = `(let value <- 6, return <- @value.value)`
      expect(fleek(program)).toEqual(`6`)
    })
  })
  describe('interface', () => {
    it('should not be possible to access an undefined Interface', () => {
      const program = `(let value <- 6, return <- @value.interface)`
      expect(fleek(program)).toEqual(`()`)
    })
    it('should be possible to access an explicitly defined Interface', () => {
      const program = `
        : Number
        let value <- 6
        return <- @value.interface
      `
      expect(fleek(program)).toEqual(`Number`)
    })
  })
})

describe('access', () => {
  it('should not be possible to access an identity before creation', () => {
    const program = `(value, let value <- 6)`
    expect(() => fleek(program)).toThrow()
  })
})

describe('updating', () => {

})

// # Access
//
// @number           # @number
// @number.value     # 6
// @number.type      # 'Number'
// @number.interface # ()
// @string.interface # String
//
// # Updating
//
// @number <- 3      # @number
// number            # 3
