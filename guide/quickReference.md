# Quick Reference

## Comments

```fl
# Single line comment

#~
  Block comment #~ can be nested ~#
~#
```

You can quickly toggle comments like this:

```fl
#~#
let add <- \(_0 + _1)
~#
```

Just delete the second `#` on the first line.

## Data

```fl
42

```

## Indentation

Indentation reflects how your code is nested

```fl
# original code
div
  header
    h1 'My awesome app'
  ul
    li 'Item #1'
    li 'Item #2'

# parsed
(
  div (
    header (h1 'My awesome app'),
    ul (li 'Item #1', li 'Item #2')
  )
)
```

## Modules

import

importSyntax

importAsync

export

destructuring

importing globals

libraries

relative paths
