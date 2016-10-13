# Compiling

> These are rough notes for implementing a compiler, you can stop reading now.

## Stages

1. Compiled to S-expression based `.fls` format
2. Compiled to JavaScript

## FLS

Fleek is a Chomsky level 0 language so typical approaches to tokenization won't work.

We can create "fat tokens" with lexical parsing.

```fl
importSyntax {tags} from '@fleek/dom'

: Stream (Number)
let reducer <- ${0}

: Number => Element
let Counter <- \(state), (
  div
    button {onClick: \($reducer <-- \(_ - 1))} '+'
    div state
)

export Counter
```

Becomes:

```js
{
  0:  ['import',        [`importSyntax {tags} from '@fleek/dom'`]],
  1:  ['interface',     [`: Stream (Number)`]],
  2:  ['default',       [`let reducer <- `, 3]],
  3:  ['stream',        [`\${`, 4, `}`]],
  4:  ['number',        [`0`]],
  5:  ['interface',     [`: Number => Element`]],
  6:  ['default',       [`let Counter <- `, 7]],
  7:  ['functionPart1', [`\\(state)`]],
  8:  ['functionPart2', [`, (`, 9, `)`]],
  9:  ['default',       [`  div\n    button `, 10, ` `, 13, `\n    div state`]],
  10: ['object',        [`{onClick: `, 11, `}`]],
  11: ['functionPart1', [`\\($reducer <-- `, 12, `)`]],
  12: ['functionPart1', [`\\(_ - 1)`]],
  13: ['string',        [`'+'`]],
  14: ['export',        [`export Counter`]],
}
```

For key-value contexts (interfaces, objects, etc) we can lexically parse the first key's boundaries & start of the first value.

For value-only contexts (lists, arrays, etc) lexical parsing only tells us where the first value begins.
