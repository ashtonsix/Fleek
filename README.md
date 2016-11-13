# Fleek

> Fleek doesn't exist yet, these are design documents only

Fleek is a functional language that compiles to JavaScript.
It features a hybrid interface system that balances flexibility & safety, in addition to:

* Composable functions
* Reactive streams
* Transaction-based intertop
* High-performance tensors
* Macro-based operators
* Lisp-inspired lists
* Distributed runtime
* And more...

The following documentation is available:

* [Guide](https://ashtonwar.gitbooks.io/fleek/content/) - practical knowledge for using Fleek
* Reference - list of all operators & functions
* Specification - comprehensive test suite
* Examples

## Why?

Functional languages are great at finding bugs upfront, but can be really restrictive because they focus too much on what can be mathematically proven with static type checking. Languages like TypeScript combine static types with user assertions which is very flexible, but ignores lots of code & can't reason about how "complete" an interface is.

Fleek also combines static types & user assertions but enforces full interface coverage. Given the assertions are accurate the entire program can be proved correct. Every interface is like a comprehensive unit testing suite so when something goes wrong you know exactly how.

## Quick Sample

Here is a simple counter. Clicking the buttons updates the value & re-renders the view.

```fl
import {querySelector, mount, Element} from '@fleek/dom'
importSyntax {tags} from '@fleek/dom'

let state :: Stream (Number) <- ${0}

let Counter <- \(state :: Number) :: Element, (
  div
    button {onClick: \($state <-- \(_ - 1))} '-'
    div state
    button {onClick: \($state <-- \(_ + 1))} '+'
)

let render <- \(view :: Element) :: Empty, (
  mount
    querySelector 'body'
    view
)

state -> Counter -> render
```

The interface annotations aren't needed here, they're just for clarity.

## Inspirations

* Python - ranges, indentation
* NumPy - multi-dimensional arrays
* Octave - array syntax, linear algebra, return behavior
* Elm - chain operators, errors, comments
* Haskell - interface concept, maybe
* Clojure - lists, transactions, identifiers, creating operators
* MongoDB - interface syntax
* ReactiveX - streams
* JavaScript - destructuring, spreading, modules
* Immutable - data structures
* Lodash - chain concept, currying
* Ramda - placeholder concept, function syntax
