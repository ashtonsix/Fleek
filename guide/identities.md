# Identities

An identity is an abstract pointer that contains metadata about a value. Every value belongs to an identity & must match it's interface.
`let` creates an identity.
You can access an identity with `@`.
Calling an identity like a function will update it's value.

```fl
> let number <- 6
@number: Number
> number
6
> @number <- 5
@number: Number
> number
5
```
