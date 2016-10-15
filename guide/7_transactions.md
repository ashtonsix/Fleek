# Transactions

Native Fleek has no side-effects. Doing anything (interacting with DOM, sending network requests, etc) requires transactions.

Transactions are similar to functions but have the following differences:

* Can access imported JavaScript
* Must have an explicit interface
* Cannot pass functions or identities as arguments
* Cannot access identities in outer scope
* Can only use native functions & operators

Arguments passed to & received from JavaScript are serialized to JSON. If the JS throws it'll return an empty list.

```js
// myLibrary.js

export const add = (x, y) => x + y
```

```fl
# index.fl

import {add as addJS} from './myLibrary.js'

: (Number, Number) => Number
let add <-
Transaction
\(addJS _0 _1)
```

## Emitters

> Read the [stream guide](./6_streams.md) if you haven't already.

Emitters are transactions that return streams.

The first argument `emit` is a function you *can* pass to JavaScript, when called it appends the value to the stream.

```js
// interval.js

export const interval = (emit, every) => {
  let i = 0
  setInterval(() => { i++; emit(i) }, every)
}
```

```fl
# index.fl

import {interval as intervalJS} from './interval.js'

: (Function, \{min 0}) => Stream (Empty)
let interval <-
Emitter
\(emit, every), (
  intervalJS (emit, every)
)

interval # ${0 1 2 3 ...}
```

`flatten` is useful for working with streams of length 1.

```fl
# fetch.fl

import {fetch as fetchJS} from './fetch.js'

: (Function, String, String, Map) => Stream (Map)
let fetchTransaction <-
Emitter
\(emit, method, url, data ()), (
  fetchJS method url data emit
)

let fetch <- \(fetchTransaction (...) $> take 1)

export fetch

# index.fl

import fetch from './fetch'

requests -> fetch $> flatten # ${...responses}
```
