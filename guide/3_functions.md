# Functions

> Make sure you understand [lists](./1_types.md#lists) before reading this.

**Calling**

You can access the original argument list with `(...)`

```fl
let id <- \(...) # @id
id 1 2 3         # (1 2 3)
id <- 1 2 3      # (1 2 3)
1 2 3 -> id      # (1 2 3)
3 -> id 1 2      # (1 2 3)
```

**Defining**

`_` or `_0` is the first argument, `_1` is the second...

```fl
\(_ + 1) 1            # 2

let add <- \(_0 + _1) # add
add 3 4               # 7
```

**Defining with arguments**

```fl
\(x), (x + 1) 1       # 2
```

**Defaults**

```fl
let inc <- \(x, y 1), (x + y) # @inc

inc 5                         # 6
inc 5 3                       # 8
```

**Destructuring**

```fl
let tim <- {name: 'Tim', age: 9} # @tim
let getAge <- \({age}), (age)    # @getAge

getAge tim                       # 9

let {name, age} <- tim           # (@name, @age)
name                             # 'Tim'

let [first, second] <- [1 2 3]   # (@first, @second)
second                           # 2
```

**Spreading**

```fl
let f <- \(first, ...rest),
  (first, rest)              # @f

f 'Kaori' 'Kousei' 'Tsubaki' # ('Kaori', ('Kousei', 'Tsubaki'))
```

**Optional arguments**

```fl
let chunk <- \(size? 1, arr), ( #~ ... ~# )

chunk 0..7   # 0; 1; 2; 3; 4; 5; 6; 7
chunk 3 0..7 # 0  1  2; 3  4  5; 6  7
```

## Currying

Every function has an arity, or number of required arguments. Unless overridden this is the number of arguments accepted without defaults.
Calling a function with less arguments than required returns a partially applied function.

```fl
let add <- \(_0 + _1)  # @add
let add5 <- add 5      # @add5
add5 4                 # 9
```

Overriding arity

```fl
let func <- \(_0 _1):1 # @func
func 5                 # (5 ())
```

The placeholder / double underscore operator `__` is useful for changing argument order.

```fl
let divide <- \(_0 / _1)     # @divide
let divideBy2 <- divide __ 2 # @divideBy2
divideBy2 8                  # 4
```

Lists have their own arity equal to number of placeholders inside (cannot override). The arity of a partially applied function is the maximum of the argument's & function's unmodified arity.

## Composition

Flow right `->` takes a list from the left & appends it to a list on the right.

```fl
(arg1, arg2) -> func (arg0) # func (arg0, arg1, arg2)

f0 (a00, a01) -> f1 (a10)   # f1 (a10, f0 (a00, a01))
```

Flow left `<-` does nothing, but has low precedence - use it to ensure everything to the right is evaluated first.

```fl
f1 a10 a00 a01 -> f0    # f0 (f1 (a10, a00, a01))
f1 a10 <- a00 a01 -> f0 # f1 (a10, f0 (a00, a01))
```

A sequence of functions linked with flow operators is called a "chain".

```fl
let users <- [
  {user: 'Barney',  age: 36}
  {user: 'Fred',    age: 40}
  {user: 'Pebbles', age: 1}
]

let getYoungest <- \(
  _ ->
  sortBy 'age' ->
  head ->
  \('{_.user} is {_.age}')
) 

getYoungest users # 'Pebbles is 1'
```

## Polymorphism

A list of functions behaves like a function itself. When called the first function which matches the argument's interface is used.

```fl
let add <- (
  : (Number, Number) => Number
  \( ... )
  : (String, String) => String
  \( ... )
  : (Tensor, Number) => Tensor
  \( ... )
  : (Tensor, Tensor) => Tensor
  \( ... )
)

add 4 5              # 9
add 'Hello' 'world!' # 'Hello world!'
add [1 2] 1          # 2 3
add [1 2] [2 3]      # 3 5
```

You can alternatively use an unrestrictive interface & write branching logic inside your functions.
