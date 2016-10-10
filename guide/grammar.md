# Grammar

## Comments

```fl
# Single line comment

#~
  Block comment #~ can be nested ~#
~#
```

## Identity

Every value has a unique identity. The identity is required for updating values.

```fl
# Creation

let number <- 6              # @number
: String
let string <- 'Hello world!' # @string

# Access

@number           # @number
@number.value     # 6
@number.interface # ()
@string.interface # String

# Updating

@number 3         # @number
number            # 3
```

[Streams](./streams.md) have an additional identity you can access with the dollar `$` operator.

## Flow

## Control Structures

## Modules

import

importSyntax

importAsync

export

destructuring

importing globals

libraries

relative paths
