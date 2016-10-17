# Types

Fleek contains the following types:

* Covered in this guide: `Number`, `String`, `Array`, `Map` & `List`
* Covered in other guides: `Identity`, `Range`, `Placeholder`, `Stream`, `Interface`, `Function`, `Operator` & `Transaction`

All data is immutable.

## Numbers

```fl
12 - 6          # 6
(4 / 8) + 1 * 2 # 2.5
(4 / 8 + 1) * 2 # 3
5 % 3           # 2
5 ^ 2           # 25
```

**NaN**

```fl
100 ^ 100 ^ 100 # NaN
5 / 0           # NaN
-1 ^ 0.5        # NaN
asin 2          # NaN
NaN * 2         # NaN
```

### Logic

Every value is truthy except `0` & the empty list `()`.

```fl
true     # 1
false    # 0

6 > 5    # 1
5 == 5   # 1
!0       # 1
!'Hello' # 0
```

## Strings

```fl
'Hello'  # 'Hello'
"world!" # 'world!'
```

**Templates**

```fl
let name <- 'Jim' # @name
'Hello {name}!'   # 'Hello Jim!'
```

Backslash `\` to escape.

```fl
'\{value: 20}' # '{value: 20}'
```

Whitespace at the start of new lines is trimmed to match the shortest line.

```fl
'
    A happy ending..
      depends on when you stop your story
'
#~
A happy ending..
  depends on when you stop your story
~#
```

## Arrays

```fl
[2 4 6]                 # 2 4 6
1..3                    # 1 2 3
0..2..8                 # 0 2 4 6 8

let numbers <- 2..4..10 # @numbers

numbers -> length       # 5
numbers.1               # 4

numbers. ..2            # 2 4
numbers. 2..            # 6 8 10
numbers. 1..-1          # 4 6 8

[1 2 3]:[4]             # 1 2 3 4
1:2:3:4                 # 1 2 3 4
```

**Iteration**

```fl
let numbers <- 2..4..10
numbers -> map \(_ / 2)                # 1 2 3 4 5
numbers -> filter \(_ > 5)             # 6 8 10
numbers -> reduce 0 \(pv, v), (pv + v) # 30

let total <- 0
let i <- 0
while \(i < (numbers -> length)) \(
  @i <-- \(_ + 1)
  @total <-- \(_ + numbers.(i))
)
# total == 30
```

### Multi-dimensional arrays

> You may be looking for the [tensor guide](./5_tensors.md)

```fl
[2 4; 5 6]       # 2 4; 5 6
zeros 2 3        # 0 0 0; 0 0 0
ones  2 2 2      # [1 1] [1 1]; [1 1] [1 1]
reshape 2 3 1..6 # 1 2 3; 4 5 6

let numbers <- [1 2; 3 4; 5 6] # @numbers
numbers.(0 0)                  # 1
numbers.(2 1)                  # 6
numbers.(1 ..)                 # 3 4; 5 6
```

**Iteration**

Many iterators accept the dimension as an optional argument.

`0` = every value, `1` = rows, `2` = columns, ..., `-1` = rows reversed.

```fl
[1 2 3; 4 5 6] -> map \(_ + 3) # 4 5 6; 7 8 9

let couples <- ['Jessica' 'Rakesh'; 'Tim' 'Rihanna'] # @couples

couples -> map 1 \('{_.0} & {_.1}')                  # 'Jessica & Rakesh'
                                                     # 'Tim & Rihanna'
```

## Maps

Maps associate values with keys.

```fl
let student <- {age: 9, name: 'Arthur'} # @student

student.age                             # 9
student.('age' 'name')                  # (9 'Arthur')
student -> omit ['age']                 # {name: 'Arthur'}

student -> mapKeys \(_:_)               # {ageage: 9, namename: 'Arthur'}
{x: 5, y: 2} -> map \(_ * 2)            # {x: 10, y: 4}
```

**Computed keys**

```fl
let keyName <- 'theAnswer' # @keyName
{(keyName): 42}            # {theAnswer: 42}
```

### Circular data structures

Because all data is immutable circular structures are impossible. Data is copied, not linked.

```fl
let object <- {value: 10} # @object
@object.self <- object    # @object
object                    # {value: 10, self: {value: 10}}
```

To represent, for example, a cyclic graph you might use `Map` keys to describe edges.

```fl
let nodes <- {object: {value: 10, self: 'object'}}
```

## Lists

Any valid Fleek program is a list.
During compilation programs are transformed into S-expressions.
During runtime programs "collapse" expression-by-expression, from right-to-left.

```fl
let number <- 4 * 5 + 6 / 3
# == (let (number, + (* (4, 5), / (6, 3))))
# == (let (number, + (20, / (6, 3))))
# == (let (number, + (20, 2)))
# == (let (number, 22))
# == (@number)
```

Indentation affects list nesting

```
1
  2
  3
    4 5
  6

# == (1 (2, 3 (4 5), 6))
```

`return` makes lists more "specific".

```fl
(20, 10)           # (20, 10)
(20, return <- 10) # 10

\(let temp <- _, temp + 2) 2           # (@temp, 4)
\(let temp <- _, return <- temp + 2) 2 # 4
```

Function arguments are lists, one list can pass multiple arguments at once. You can think of functions as lists waiting to be evaluated.

Lists can be manipulated with many of the same functions + operators as arrays.

```fl
(4 5 6).2               # 6
(1 2 3) -> map \(_ * 2) # 2 4 6
```
