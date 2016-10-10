# Interfaces

Interfaces describe your data. They help you find bugs at compile time, reduce runtime errors & make operators / functions more versatile. Every function & identity has an interface. Fleek's hybrid (dynamic / static) approach to interfaces creates a strong balance between imperative flexibility & functional safety.

Most functional languages are pure, this means:

* Functions have no side-effects
* Functions always return the same result given the same arguments

Fleek is not pure, however:

* All data is immutable
* Identities have fixed interfaces
* Functions always return values with the same interface

When compiling the interface system has 3 possible outcomes:

1. Able to prove every function & operator is called with valid arguments (success)
2. Able to disprove #1 (failure)
3. Unable to prove or disprove #1 (failure)

In case #3 Fleek will identify candidate interfaces / assertions that could prove the application's correctness.
You can add these candidate assertions to your code or write your own.
Unprovable interfaces, when declared, are taken at face-value & allow the application to compile.
If the assertion is proven wrong at runtime an error is thrown.
These are the only run-time errors Fleek will encounter.

This example application would compile, but break if `mysteryNumberGenerator` returns a number greater than `1`:

```fl
import mysteryNumberGenerator from 'mysteryNumberGenerator'

: () => Number
let myFunction <- \(), (
  let number <- mysteryNumberGenerator ()
  return (
    number <= 1 ? 100 : 'Hello'
  )
)

(myFunction ()) + 5
```

## Syntax

> This guide focuses on creating interfaces, read the [functions guide](./functions) for usage examples.

Interfaces make assertions about values, assertions can transform values before evaluation. This example checks for a `Map` with properties `name` & `id` that has length 10:

```fl
Interface
\{
  Map
  name: String
  id: String
  \(length _.id): equalTo 10
  \(allRemaining _): Any
}
```

The functions used inside interfaces are different than those in the default context - they can fail (while compiling only) & accept any arguments.

You can pass arguments to interfaces themselves. The `Matrix` interface allows you to specify a number of columns & rows.

```fl
let Matrix <-
Interface
\(rows, cols), {
  Array
  \(dimension _): oneOf 1 2
  \(length 0 _): equalTo rows
  \(length 1 _): equalTo cols
  oneOf (
    all Int8, all Int16, all Int32,
    all Float32, all Float64)
  allMatch 0 length # Every row is the same length
  allMatch 1 length
}
```

You can compare unknown interface arguments (uses post-transform values). This is important for checking matrix dimensions match.

```fl
: (Matrix (m a), Matrix (a n)) => Matrix (m n)
let multiply <- \(m0, m1), ( ... )

: (
:   Matrix (m a), Matrix (a 1), Matrix(m 1)
:   \{Number, min 0}, \{Number, min 0}
: ) => Matrix (m 1)
let gradientDescent <- \(
  data, trainingResults, theta
  learningRate, iterations
), ( ... )
```

Interfaces for functions append their runtime arguments to the interface arguments you provide.

```fl
# (eye 2) == [1 0; 0 1]
: Number => Matrix \(_, _)
let eye <- \(size), ( ... )

# (repeat 3 'ab') == 'ababab'
: (Number, String) => \(repetitions, str),
:                     {String, \(length _): repetitions * (length str)}
let repeat <- \(repetitions, str) -> ( ... )
```

You can use placeholders for interface arguments you don't care about: `Matrix (__, 1)` matches all matrices with 1 column.

You can nest interfaces recursively or like onions.

```fl
let BinaryTree <-
Interface
\{
  parent: BinaryTree
  left: BinaryTree
  right: BinaryTree
  key: oneOf (Number, String)
  value: Any
}

: Stream (Maybe (Matrix (__, 1)))
let LearningStream <- (...)
```

## Type checking

Fleek can prove much of your code is safe. Fleek's hybrid interface system allows unproven interfaces when annotated as described above (top of guide). When Fleek reassigns identities or calls functions & is unable to prove values match interfaces a type check is required, these can be slow.

Consistency can alleviate this problem. Data with a fixed structure is easier to reason about. Treat your data consistently too - for example `filter` can accept a `Matrix` (because every `Matrix` is also an `Array`) but it might or might not return a `Matrix`, using filter inside a function that manipulates matrices could be a mistake.

Interfaces exist to make building things easier. Focus on clarity rather than completeness - your application may become hard to modify or perform slowly if you do not heed this advice. Once you've understood interfaces you can mostly ignore them.

## functions

```fl
: (Interface, Any) => \{oneOf 0 1}
matches
```

```fl
: (Interface, Interface) => \{oneOf 0 1}
collides
```

## Default interfaces

Fleek has an interface for every type in addition to: `Float`, `Integer`, `Number`, `Any`, `Empty`, `Maybe` & `Matrix`.

* `Float` contains `Float32` & `Float64`
* `Integer` contains `Int8`, `Int16` & `Int32`
* `Number` contains `Float` & `Integer`. Every `Number` value supports the same operators & functions
* `Any` matches anything
* `Empty` matches the empty list only
* `Maybe` matches either `Empty` or any other interface (passed as argument)
* `Matrix` is detailed inside the [matrix guide](./matrices.md)

Every interface is wrapped with `Maybe` by default. This makes static analysis much easier & keeps your application flexible. You can explicitly disallow empty lists, this is *not* advisable in the general case.

```fl
: \{Any, not Empty}
```

Every native function & operator handles empty lists, either by returning an empty list or the identity of another argument.

```fl
> 4 + ()
4
> has 'key' ()
()
```
