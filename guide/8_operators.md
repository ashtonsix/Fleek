# Operators

Operators let you create custom syntax for your program or library.

Operators accept a fixed number of arguments & must have explicit interfaces, any interface or syntax conflict with another defined operator precludes successful compiling.

```fl
let xor <-
  Op{__ xor __}, \
  (x :: Any, y :: Any) :: Number,
  ((x ? !y : y) ? 1 : 0)

1 xor 1 # 0
1 xor 0 # 1
0 xor 1 # 1
0 xor 0 # 0
```

Operators have a syntax conflict if they share one or more symbols (`for _ in __` contains `for` & `in`) but don't have identical syntax & precedence. Operators have an interface conflict if they have identical syntax & any set of arguments could match bothe operators.

You can bundle conflicting operators together, the first operator to match is used.

```fl
let listComprehension <- \\(
  Op{for __ in __ if __}, \
  (f :: Function, arr :: Array, cond :: Function) :: Array,
  (arr -> map f -> filter cond)

  Op{for __ in __}, \
  (f :: Function, arr :: Array) :: Array,
  (listComprehension.0 f arr \(true))
)

for \(_ + 2) in [1 2 3]          # [3 4 5]
for \(_ + 2) in 1..9 if \(_ < 7) # [3 4 5 6]

exportSyntax {listComprehension}
```

Precedence is inversely proportional to how "grabby" an operator is:

```txt
# OP1 has higher precedence
(a OP1 b) OP2 c

# OP2 has higher precedence
a OP1 (b OP2 c)
```

In a tie the operator on the left is considered to have higher precedence. By default custom operators have precedence 20 (highest possible).

```fl
let lowPrecedenceOp <- Op{OP __}, (arg :: Any) :: Any, (_):4
```

You can use `__1` to indicate the operator should grab one symbol only. `__1 . __1` might capture `a (b.c)`.

## Context

> You cannot define contexts yourself

Fleek's syntax varies based on context. For example, a colon `:` can indicate:

* concatenation (default)
* 'else' condition (ternary)
* key-value seperation (key)
* interface assignment (newline)

Contexts have start/end conditions & a set of operators/functions that can be used inside.

To learn more about contexts you should read the [compiler's internal docs](../src/docs/README.md).
