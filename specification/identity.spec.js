const fleek = jest.fn()

describe('creation', () => {
  it('should create an identity', () => {
    const program = `let value <- 6`
    expect(fleek(program)).toEqual(`@value`)
  })
  describe('type', () => {
    it('should create a Number', () => {
      const program = `
        let value <- 6
        return <- @value.type
      `
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
      const program = `
        let value <- 6
        return <- @value.value
      `
      expect(fleek(program)).toEqual(`6`)
    })
  })
  describe('interface', () => {
    it('should have an undefined Interface', () => {
      const program = `
        let value <- 6
        return <- @value.interface
      `
      expect(fleek(program)).toEqual(`()`)
    })
    it('should have an Interface', () => {
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
  it('should not access before creation', () => {
    const program = `(value, let value <- 6)`
    expect(() => fleek(program)).toThrow()
  })
  describe('scope', () => {
    it('should not access in a lower scope', () => {
      const program = `
        (let value <- 6)
        value
      `
      expect(() => fleek(program)).toThrow()
    })
    it('should access in a higher scope', () => {
      const program = `
        let value <- 6
        return <- (value)
      `
      expect(fleek(program)).toEqual('6')
    })
    it('should access in a function', () => {
      const program = `
        let value <- 6
        let func \(value)
        return <- func ()
      `
      expect(fleek(program)).toEqual('6')
    })
    it('should access in an isolated scope', () => {
      const program = `
        let func <- (
          let value <- 6
          return \(value)
        )
        return <- func ()
      `
      expect(fleek(program)).toEqual('6')
    })
  })
})

describe('updating', () => {
  it('should update a value', () => {
    const program = `
      let value <- 6
      @value <- 3
      return <- value
    `
    expect(fleek(program)).toEqual('3')
  })
  describe('modules', () => {
    it('should not update an import', () => {
      const lib = `
        : Number
        let value <- 6
        export value
      `
      const program = `
        import value from lib
        @value <- 3
      `
      expect(() => fleek(program, {lib})).toThrow()
    })
  })
  describe('immutablity', () => {
    it('should copy an identity', () => {
      const program = `
        let value <- 6
        let id <- @value
        @value <- 3
        return id.value
      `
      expect(fleek(program)).toEqual('6')
    })
  })
  describe('functions', () => {
    it('should access the updated identity', () => {
      const program = `
        let value <- 6
        let func <- \(value)
        @value <- 3
        return func ()
      `
      expect(fleek(program)).toEqual('3')
    })
    it('should access the updated identity inside a partially applied function', () => {
      const program = `
        let value <- 6
        let incrementId <- \(id, increment), (@id.value + increment)
        let incrementValue <- func @value
        @value <- 3
        return (value, incrementValue 5)
      `
      expect(fleek(program)).toEqual('(3 8)')
    })
  })
})
