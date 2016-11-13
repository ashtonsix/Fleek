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

let myFunction <- \() :: Number, (
  let number <- mysteryNumberGenerator ()
  return <-
    number <= 1 ? 100 : 'Hello'
)

myFunction ()
```

## Usage

The interface context uses a subset of the native library.

```fl
let Node <-
\{
  Map
  name: String
  id: String
  \(length _.id): equalTo 10
  (...): Any
}

let node :: Node <- {name: 'Abyss', id: 'dy26fo7bic', other: 5}

conflicts Number String   # 0
conflicts \{min 0} Number # 1

matches \{min 0} 5       # 1
matches \{min 0} -2      # 0
matches \{min 0} 'Test'  # 0
```

Interfaces can accept & compare arguments

```fl
let Matrix <-
\{rows, cols}, {
  Array
  all Number
  \(dimension _): lessThanEqual 2
  \(length _ 0): equalTo rows
  \(length _ 1): equalTo cols
  isUniform length 0
  isUniform length 1
}

let columnVector :: Matrix (__ 1) <- [5; 6; 4]

# Argument comparison

let multiply <- \(
  m0 :: Matrix (m, a)
  m1 :: Matrix (a, n)
)    :: Matrix (m, n),
( #~ ... ~# )
```

Return interfaces accept explicit arguments followed my arguments passed to the function.

```fl
# Function arguments

let eye <- \(size :: Number) :: Tensor \(_, _), ( #~ ... ~# )

eye 2 # 1 0
      # 0 1

let RepeatedString <-
\{repetitions, str}, {
  String,
  \(length _): repetitions * (length str)
}

let repeat <- \(repetitions, str) :: RepeatedString -> ( ... )

repeat 3 'ab' # 'ababab'
```

**Spreading**

```fl
let omitAt <- \(arr :: Array, ...indices :: Number) ( #~ ... ~# )

omitAt 0..8 3 4 6 # [0 1 2 5 7 8]
```

**Recursion**

```fl
let BinaryTree <-
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

Provable code is often faster, safer & easier to reason about. For most interfaces there will be a "safe" subset of functions that always returns valid data, a preference towards these is advisable. For example every `Tensor` is an `Array` - so you can `filter` any `Tensor`, the result may or may not be a `Tensor`. Thus you should avoid filtering tensors if you depend on the result being a `Tensor`.

## Native interfaces

Fleek has an interface for every [type](./1_types.md) in addition to: `Any`, `Empty` & `Tensor`.

* `Any` matches anything
* `Empty` matches the empty list only
* `Tensor` is described inside the [tensor guide](./5_tensors.md)

Every native function & operator accepts empty lists, either by returning a default or the identity of another argument.

```fl
4 + ()      # 4
map \(_) () # []
```
