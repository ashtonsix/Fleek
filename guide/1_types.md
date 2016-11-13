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
let name <- 'Jim' # @name: 'Jim'
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
[2 4 6]                 # [2 4 6]
1..3                    # [1 2 3]
0..2..8                 # [0 2 4 6 8]

let numbers <- 2..4..10 # @numbers: [2 4 6 8 10]

numbers -> length       # 5
numbers.1               # 4

numbers. ..2            # [2 4]
numbers. 2..            # [6 8 10]
numbers. 1..-1          # [4 6 8]

[1 2 3]:[4]             # [1 2 3 4]
1:2:3:4                 # [1 2 3 4]
```

**Iteration**

```fl
let numbers <- 2..4..10                # @numbers: [2 4 6 8 10]
numbers -> map \(_ / 2)                # [1 2 3 4 5]
numbers -> filter \(_ > 5)             # [6 8 10]
numbers -> reduce \(pv, v), (pv + v) 0 # 30

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
[2 4; 5 6]       # [2 4; 5 6]
zeros 2 3        # [0 0 0; 0 0 0]
ones 2 2 2       # [[1 1] [1 1]; [1 1] [1 1]]
reshape 2 3 1..6 # [1 2 3; 4 5 6]

let numbers <- [1 2; 3 4; 5 6] # @numbers: [1 2; 3 4; 5 6]
numbers.(0, 0)                 # 1
numbers.(2, 1)                 # 6
numbers.(1, ..)                # [3 4]
```

**Iteration**

Many iterators accept the dimension as an optional argument.

`0` = every value, `1` = rows, `2` = columns, ...

```fl
[1 2 3; 4 5 6] -> map \(_ + 3) # [4 5 6; 7 8 9]
```

```fl
let couples <- ['Jessica' 'Rakesh'; 'Tim' 'Rihanna']

couples -> map \('{_.0} & {_.1}') 1 # ['Jessica & Rakesh'; 'Tim & Rihanna']
```

## Maps

Maps associate values with keys.

```fl
let student <- {age: 9, name: 'Arthur'} # @student: {age: 9, name: 'Arthur'}

student.age                             # 9
student.('age', 'name')                 # (9 'Arthur')
student -> omit ['age']                 # {name: 'Arthur'}

student -> mapKeys \(repeat 2 _)        # {ageage: 9, namename: 'Arthur'}
{x: 5, y: 2} -> mapValues \(_ * 2)      # {x: 10, y: 4}
```

**Computed keys**

```fl
let keyName <- 'theAnswer' # @keyName
{(keyName): 42}            # {theAnswer: 42}
```

**Virtuals**

```fl
let currentYear <- 2016

let creatorOfFleek <- {
  birthDate: 1993,
  get age: \(currentYear - _.birthDate)
  set age: \
    (value, self),
    (@self.birthDate <- currentYear - value)
}

creatorOfFleek.age         # 23
@creatorOfFleek.age <- 100 # @creatorOfFleek
creatorOfFleek.birthDate   # 1916
```

**Proxies**

```fl
let myObject -> {
  set \
    (key, value, self),
    (@self.(key) <- value / 2)
}

myObject.x <- 4 # @myObject
myObject.x      # 2
```

### Circular data structures

Because all data is immutable circular structures are impossible. Data is copied, not linked.

```fl
let object <- {value: 10} # @object
@object.self <- object    # @object
object                    # {value: 10, self: {value: 10}}
```

To store, for example, a cyclic graph you might use virtuals to describe edges.

```fl
let nodes <- {}
@nodes.object <- {
  value: 10,
  _self: 'object',
  get self: \(nodes.(_._self))
}

nodes.object.self.self.value # 10
```

## Lists

Any valid Fleek program is a list.
During compilation programs are transformed into S-expressions.
During runtime programs "collapse" expression-by-expression.

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

A list containing one value is equivalent to that value.

```fl
(1) + 2    # 3
(1, 2) + 4 # will not compile
```

Lists can be converted to arrays.

```fl
(1 2 3) ->
  toArray ->
  map \(_ * 2) ->
  toList           # (2, 4, 6)
```
