# Interfaces

Interfaces describe your program, identifying errors during compilation & runtime. Every function & identity has an interface.

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
3. Unable to prove or disprove #1
  * Checks for explicit interfaces, if present the application compiles (success)
  * Candidate interfaces presented (add to code or write your own)

Unproved interfaces are checked at runtime, if invalid an error is thrown.
These are the only runtime errors you will encounter.

This example program would compile, but break if `mysteryNumberGenerator` returns a number greater than `1`:

```fl
import mysteryNumberGenerator from 'mysteryNumberGenerator'

: () => Number
let myFunction <- \(), (
  let number <- mysteryNumberGenerator ()
  return <-
    number <= 1 ? 100 : 'Hello'
)

myFunction ()
```

## Usage

The interface context has it's own native library - functions can fail & accept any arguments.

```fl
let Node <-
Interface
\{
  Map
  name: String
  id: String
  \(length _.id): equalTo 10
  \(allRemaining _): Any
}

: Node
let node <- {name: 'Abyss', id: 'dy26fo7bic', other: 5}

collides Number String   # 0
collides \{min 0} Number # 1

matches \{min 0} 5       # 1
matches \{min 0} -2      # 0
matches \{min 0} 'Test'  # 0

# Interface arguments

let Matrix <-
Interface
\(rows, cols), {
  Array
  all Number
  \(dimension _): lessThanEqual 2
  \(length 0 _): equalTo rows
  \(length 1 _): equalTo cols
  allMatch 0 length # Every row is the same length
  allMatch 1 length
}

: Matrix (__ 1)
let columnVector <- [5; 6; 4]

# Argument comparison

: (
:   Matrix (m a)
:   Matrix (a n)
: ) => Matrix (m n)
let multiply <- \(m0, m1), ( ... )
```

Function interfaces append their runtime arguments to the interface arguments you provide

```
: (Number, Number) => Number
let add <- \(_0 + _1)

# Function arguments

: Number => Matrix \(_, _)
let eye <- \(size), ( ... )

eye 2 # 1 0
      # 0 1

let RepeatedString <-
Interface
\(repetitions, str), {
  String,
  \(length _): repetitions * (length str)
}

: (Number, String) => RepeatedString
let repeat <- \(repetitions, str) -> ( ... )

repeat 3 'ab' # 'ababab'

# Spreading

: (Array, ...Number) => Array
let omitAt <- \( #~ ... ~# )

omitAt 0..8 3 4 6 # [0 1 2 5 7 8]

# Recursion

let BinaryTree <-
Interface
\{
  parent: BinaryTree
  left: BinaryTree
  right: BinaryTree
  key: oneOf (Number, String)
  value: Any
}
```

## Runtime checking

Fleek can prove a lot of your code is valid. When it can't runtime checks are required, these checks can be expensive.

Provable code is often faster, safer & easier to reason about. For most interfaces there will be a "safe" subset of functions that always returns valid data, a preference towards these is advisable. For example every `Matrix` is an `Array` - so you can `filter` any `Matrix`, the result may or may not be a `Matrix`. Thus you should avoid filtering matrices if you depend on the result being a `Matrix`.

## Native interfaces

Fleek has an interface for every [type](./1_types.md) in addition to: `Any`, `Empty` & `Matrix`.

* `Any` matches anything
* `Empty` matches the empty list only
* `Matrix` is described inside the [matrix guide](./5_matrices.md)

Every interface also accepts the empty list by default, which makes static analysis easier & keeps your application flexible. You can explicitly disallow empty lists.

```fl
: \{Any, not Empty}
```

Every native function & operator handles empty lists, either by returning an empty list or the identity of another argument.

```fl
> 4 + ()
4
> map \(_) ()
()
```
