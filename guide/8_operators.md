# Operators

Operators let you create custom syntax for your program or library.

Operators accept a fixed number of arguments & must have explicit interfaces, any type or syntax conflict with another defined operator precludes successful compiling.

```fl
: (Any, Any) => Number
let xor <-
Operator{__ xor __}, \((_0 ? !_1 : _1) ? 1 : 0)

1 xor 1 # 0
1 xor 0 # 1
0 xor 1 # 1
0 xor 0 # 0
```

Operators that conflict can be bundled in lists, the first operator is used in a conflict.

```fl
let listComprehension <- (
  : (Function, Array) => Array
  Operator{for __ in __}, \(listComprehension.0 (..., \(true)))
  : (Function, Array, Function) => Array
  Operator{for __ in __ if __}, \(f0, arr, f1), (
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
let lowPrecedenceOp <- Operator{OP __}, (_):3
```

You can use `__1` to indicate the operator should grab one symbol only. `__1 . __1` might match `a (b.c)`

Most native operators extract the first value when passed a list

## Conflicts

Operators conflict if this function returns true:

```js
// Example:
// operatorsConflict(
//   {syntax: 'for __ in __', precedence: 5, interfaces: [FunctionInterface, ArrayInterface]},
//   {syntax: 'for __ in __ if __', precedence: 5, interfaces: [FunctionInterface, ArrayInterface, FunctionInterface]}
// )
const operatorsConflict = (op1, op2) => {
  const sharesToken = (s1, s2) => {
    s1 = new Set(s1)
    for (let i = 0; i < s2.length; i++) {
      if (s1.has(s2[i])) return true
    }
  }
  const s1 = op1.syntax.split('__').map(str => str.trim())
  const s2 = op1.syntax.split('__').map(str => str.trim())
  const syntaxEqual = s1.join('__') === s2.join('__') && op1.precedence === op2.precedence
  if (sharesToken(s1, s2) && !syntaxEqual) return true
  if (syntaxEqual) return interfacesConflict(op1.interface, op2.interface)
  return false
}
```

The [interface guide](./4_interfaces.md.md#usage) describes interface conflict.

## Context

> You cannot define contexts yourself

Fleek's syntax varies based on context. For example, a colon `:` can indicate:

* concatenation (default)
* 'else' condition (ternary)
* key-value seperation (key)
* interface assignment (newline)

Contexts have start/end conditions & a set of operators/functions that can be used inside.
