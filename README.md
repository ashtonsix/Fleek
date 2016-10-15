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

## Quick Sample

Here is a simple counter. Clicking the buttons updates the value & re-renders the view.

```fl
import {querySelector, mount, Element} from '@fleek/dom'
importSyntax {tags} from '@fleek/dom'

: Stream (Number)
let reducer <- ${0}

: Number => Element
let Counter <- \(state), (
  div
    button {onClick: \($reducer <-- \(_ - 1))} '-'
    div state
    button {onClick: \($reducer <-- \(_ + 1))} '+'
)

: Element => ()
let render <- \(view), (
  mount
    querySelector `body`
    view
)

: Stream
reducer -> Counter -> render
```

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
