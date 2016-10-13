# Operators

Operators let you create custom syntax for your program or library.

```fl
: Number => Number
let abs <-
Operator{|_|}, \(_ < 0 ? _ * -1 : _)

| 3| # 3
|-3| # 3
```


```fl
let listComprehension <- (
  : (Function, Array) => Array
  Operator{for _ in _}, (listComprehension.1 (..., \(true))
  : (Function, Array, Function) => Array
  Operator{for _ in _ if _}, \(f0, arr, f1), (
    arr -> map f0 -> filter f1
  )
)

for \(_ + 2) in [1 2 3]          # 3 4 5
for \(_ + 2) in 1..9 if \(_ < 7) # 3 4 5 6

exportSyntax {listComprehension}
```

Precedence is inversely proportional to how "grabby" an operator is:

```txt
# OP1 has higher precedence
(a OP1 b) OP2 c => (OP2 (OP1 (a, b), c))

# OP2 has higher precedence
a OP1 (b OP2 c) => (OP1 (a, OP2 (b, c)))
```

In a tie the operator on the left is considered to have higher precedence. By default custom operators have precedence 20 (highest possible).

```fl
let lowPrecedenceOp <- Operator{OP _}, (_):3

```

Operators accept a fixed number of arguments, must have explicit interfaces, and any ambiguity regarding which operator to use prevents successful compiling.
