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

import {add as addJS} from ./myLibrary.js

: (Number, Number) => Number
let add <-
Transaction
\(addJS _0 _1)
```
