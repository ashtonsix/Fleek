# Fleek

> Fleek doesn't exist yet, these are design documents only

Fleek is a functional language that compiles to JavaScript.
It features a hybrid interface system that balances flexibility & safety, in addition to:

* Composable functions
* Reactive streams
* Transaction-based intertop
* High-performance matrices
* Macro-based operators & contexts
* Lisp-inspired lists
* And more...

The following documents are available:

* Guide - everything you need to use Fleek
* Reference - list of all operators & functions
* Specification - comprehensive test suite

## Quick Sample

Here is a simple counter. Clicking the buttons updates the value & re-renders the view.

```fl
import {querySelector, mount} from '@fleek/dom'
import {div, button} from '@fleek/tags'

: Stream (Number)
let state <- ${0}

: Number => Element
let Counter <- \(value), (
  div
    button ({onClick: \($state <-- \(_ - 1))}, `-`)
    div value
    button ({onClick: \($state <-- \(_ + 1))}, `+`)
)

: Element => ()
let render <- \(view), (
  mount
    querySelector `body`
    view
)

: Stream (Number => ())
state -> Counter -> render
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
