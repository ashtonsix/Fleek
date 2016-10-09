# Data Types

> You rarely have to worry about number types, numbers are `Float64` by default (same as JavaScript).

Fleek contains the following data types: `String`, `Array`, `Map`, `Int8`, `Int16`, `Int32`, `Float32`, `Float64`.

## Numbers

Basic math looks normal:

```fl
> 12 - 6 + 7
13
> 4 / 8 + 1 * 2
2.5
> (4 / 8 + 1) * 2
3
> 5 % 3
2
> 5 ^ 2
25
```

Numbers that are indeterminate, complex, or exceed their bounds equal `NaN`. Operations where NaN is a parameter also equal NaN.

```fl
> (
.   100 ^ 100 ^ 100
.   Int8 257
.   5 / 0
.   -1 ^ 0.5
.   asin 2
.   NaN * 2
. )
(NaN, NaN, NaN, NaN, NaN, NaN)
```

### Logic

There are no booleans. Every value is truthy except `0` & the empty list `()`.
All comparison operators return `0` or `1`.
The `true` & `false` operators are aliases for `1` & `0`.

```fl
> true
1
> false
0
> 6 > 5
1
> 5 <= 2
0
> 5 == 5
1
> (Int32 5) == 5
0
> !0
1
> !'Hello'
0
```

## Strings

You can use single `''`, or double `""` quotes.
Backslash `\` to escape. Curly brackets `{}` for templates.
Multi-line strings work fine. Whitespace at the start of new lines is trimmed to match the shortest line.

```fl
> let name <- 'Jim'
@name: String
> '
.   Hello {name}!
.     \'Hi.\'
. '
Hello Jim!
  'Hi.'
```

## Arrays

Arrays can contain multiple items. Iterate over arrays with functions like `map`, `reduce` & `filter`.

```fl
> let numbers <- [2 4 3]
@numbers: Array
> numbers -> length
3
> numbers -> map \(_ * 2)
4 8 6
> numbers.(0)
4
```

Arrays can be multi-dimensional.

```fl
> let numbers <- [2 4; 5 6]
@numbers: Array
> numbers -> map \(_ + 2)
4 6
7 8
> numbers.(1, 0)
7
> let numbers3d <- [[0 0] [0 1]; [1 0] [1 1]]
@numbers: Array
> numbers3d
[0 0] [0 1]
[1 0] [1 1]
> numbers3d.(0, 1)
0 1
> numbers3d.(0, 1, 1)
1
```

`map` takes the dimension as an optional argument, to, for example, iterate through rows or columns.
`0` = every value, `1` = rows, `2` = columns, ..., `-1` = rows reversed.

```fl
> let couples <- ['Jessica' 'Rakesh'; 'Tim' 'Rihanna']
@couples: Array
> couples -> map \('{_.0} & {_.1}') 1
'Jessica & Rakesh'
'Tim & Rihanna'
```

You can use [ranges](./logicalTypes.md#Ranges) to create, slice, splice & concatenate arrays.

```fl
> 0..2..8
0 2 4 6 8
> let numbers <- Array (0..3, 0..3)
@numbers: Array
> numbers
0 1 2 3
1 2 3 4
2 3 4 5
3 4 5 6
> numbers(1.., ..1::3)
1 2 4
2 3 5
3 4 6
```

## Maps

Maps associate values with keys.

```fl
> let student <- {age: 9, name: 'Arthur', favoriteSubject: 'Chinese'}
@student: Map
> student.age
9
> student.(join 'na' 'me')
'Arthur'
> student -> omit ['age']
{name: 'Arthur', favoriteSubject: 'Chinese'}
```

You can pass multiple arguments to the property access operator `.`

```fl
> student
{age: 9, name: 'Arthur', favoriteSubject: 'Chinese'}
> student.('age', 'name')
(9, 'Arthur')
```

Maps can be nested, or recursive.

```fl
> let teacher <- {name: 'Tabitha', students: [student]}
@teacher: Map
> @student.teacher <- teacher
@student: Map
> student.teacher.students.0 == student
1
```

## Lists

Any valid Fleek code is a list.

Midway through compilation Fleek is represented with S-expressions which makes the list structure more apparent:

```fl
# Before:
let number <- 4 * 5 + 6 / 3
let arr <- [50] -> concat [number]

# After:
(
  let (number, (+ (* (4, 5), / (6, 3)))),
  let (arr, (concat ([number], [50])))
)
```

When evaluated lists collapse line-by-line from right-to-left:

```fl
( let (number, (+ (* (4, 5), / (6, 3)))),
  let (arr, (concat ([number], [50]))) )

( let (number, (+ (20, 2))),
  let (arr, (concat ([number], [50]))) )

( let (number, 22)),
  let (arr, (concat ([number], [50]))) )

( @number: Number,
  let (arr, (concat ([number], [50]))) )

( @number: Number,
  let (arr, [number, 50]) )

( @number: Number, @arr: Array )
```

Arguments are always passed into functions via lists. As you saw in the above example one list can pass multiple arguments at once. You can think of a function as a list waiting to be evaluated. In fact, if you convert any valid list to a function & then call that function it will return an equal list.

Example:

```fl
> let list0 <- \(
.   let number <- 4 * 5 + 6 / 3
.   let arr <- [50] -> concat [number]
. ) ()
@list0: (Number, Array)
> let list1 <- (
.   let number <- 4 * 5 + 6 / 3
.   let arr <- [50] -> concat [number]
. )
@list1: (Number, Array)
> list0 == list1
1
```

Lists can be manipulated with many of the same functions + operators as arrays.
