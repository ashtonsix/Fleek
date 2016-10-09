# Functions

Functions accept lists of arguments, from the left or right.

```fl
> let id <- \(...):3
@id: Function
> (
.   id (1, 2, 3)
.   (1, 2, 3) -> id
.   (3) -> id (1, 2)
. )
((1, 2, 3), (1, 2, 3), (1, 2, 3))
```

Data types don't "collapse" so you can often omit the list syntax.

```fl
> 1 2 3
(1, 2, 3)
> (
.   id 1 2 3
.   1 2 3 -> id
.   3 -> id 1 2
. )
((1, 2, 3), (1, 2, 3), (1, 2, 3))
```

You can define functions without specifying their arguments: `_` or `_0` is the first argument, `_1` is the second...

```fl
> \(_ + 1) 1
2
> let add <- \(_0 + _1)
@add: Function
> add 3 4
7
```

If you want naming, defaults, destructuring or spreading you should specify your arguments.

```fl
> \(x), (x + 1) 1
2
> let inc <- \(x, y 1), (x + y)
@inc: Function
> (inc 1, inc 2 3)
(2, 5)
```

```fl
> \({name, age}, [owner, item], ...rest), (
.   (name, age)
.   (owner, item)
.   rest
. ) (
.   {name: 'Fred', age: 18}
.   ['Angela', 'spoon']
.   'Midget', 'army'
. )
(('Fred', 18), ('Angela', 'spoon'), ('Midget', 'army'))
```

Calling `return` stops list evaluation & makes lists more "specific". If `return` isn't called a function will return its entire list.

```fl
> (5, return <- 6)
6
> let func <- \(
.   let callReturn <- !_
.   callReturn
.   callReturn ? return <- 5
. )
@func: Function
> func 1
(@callReturn: Number, 0, ())
> func 0
5
```

You can access the original argument list with `(...)`

## Currying

Every function has an arity, or number of required arguments. Unless overridden this is the number of arguments accepted without defaults.
Calling a function with less arguments than required returns a partially applied function.

```fl
> let add <- \(_0 + _1)
@add: Function
> let inc5 <- add 5
@inc5: Function
> inc5 4
9
```

If a function's arity is underset & called with an insufficient amount of arguments they will each default to the empty list `()`.

```fl
> let func <- \(_0, _1): 1
@func: Function
> func 5
(5, ())
```

You can use the placeholder / double underscore operator `__` inside arguments. This is useful if you want to change the order of arguments.

```fl
> let divide <- \(_0 / _1)
@divide: Function
> let divideBy2 <- divide __ 2
@divideBy2: Function
> divideBy2 8
4
```

Lists also have their own arity equal to number of placeholders inside (cannot override), the arity of resulting functions is the maximum of the argument's & function's unmodified arity.

## Composition

Lists "collapse" from right to left into functions which evaluate them, this forms the basis of all computation in Fleek. Many operators will "re-arrange" lists during compilation. Two of these: the flow right `->` & flow left `<-` operators let you compose functions naturally.

Flow right takes everything from the left (until an operator with lower precedence) & appends it to a list on the right (just before another operator with lower precedence).

```fl
# Before:
(arg1, arg2) -> func (arg0)
func0 (arg0_0, arg0_1) -> func1 (arg1_0)

# After:
func (arg0, arg1, arg2)
func1 (arg1_0, (func0 (arg0_0, arg0_1)))
```

By virtue of having (practically) the lowest precedence amongst all operators flow left can ensure everything to the right runs first. Using it with every pertinent return or assignment is a good habit.

```fl
# Before:
func2 <- func0 (arg0_0, arg0_1) -> func1 (arg1_0)

# After:
func2 (func1 (arg1_0, (func0 (arg0_0, arg0_1))))
```

Wrapping chains in functions gives you composition.

```fl
let users <- [
  {user: 'Barney',  age: 36}
  {user: 'Fred',    age: 40}
  {user: 'Pebbles', age: 1}
]
 
let getYoungest <- \(_ -> sortBy 'age' -> head -> \('{_.user} is {_.age}'))

getYoungest users # 'Pebbles is 1'
```

You can combine chains easily.

```fl
let people <- {13: 'Jack', 234: 'Jill'}
let items <- [
  {owner: 'Jack', value: 'pail'}
  {owner: 'Jack', value: 'well'}
  {owner: 'Jill', value: 'water'}
]

(
  people -> toPairs -> map \({id: _.0, name: _.1})
  items -> map (renameKey 'owner' 'name')
) ->
indexBy 'owner' -> map \({..._.0.0, items: map \(_.value) _.1})

#~
  [
    {id: 13, name: 'Jack', items: ['pail', 'well']}
    {id: 234, name: 'Jill', items: ['water']}
  ]
~#
```

## Polymorphism

A list of functions behaves like a function itself. When called the first function which matches the argument's interface is used.

```fl
let map <- (
  : (Array, Function) => Array
  \(arr, f), (map arr 0 f)
  : (Array, Number, Function) => Array
  \(arr, dimension, f), (
    # ...
  )
  # ...
)
```

Interfaces can be as general or specific as you need, thus you can use branching logic inside functions to handle different types though this approach could make your application harder to predict & reason about.
