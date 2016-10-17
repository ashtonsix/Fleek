# Grammar

The following topics are not covered in this guide:
[chaining](./3_functions.md#composition), [destructuring](./3_functions.md) & [iteration](./1_types.md#arrays)

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
let number <- 6              # @number
: String
let string <- 'Hello world!' # @string

@number           # @number
@number.value     # 6
@number.type      # 'Number'
@number.interface # ()
@string.interface # String

@number <- 3      # @number
number            # 3
```

[Streams](./streams.md) have an additional identity you can access with the dollar `$` operator.

## Control Flow

**Conditions**

```fl
1 ? 'True'           # 'True'
0 ? 'True'           # ()
0 ? 'True' : 'False' # 'False'
0 | 'True'           # 'True'
'True' | 0           # 'True'
0 & 'True'           # 0
```

**Switching**

```fl
let key <- 'Unicorn'
switch
  key
  {
    first: 'first'
    second: 'second'
  }
  'default'
# == 'default'
```

## Modules

Every export in your program's entry file requires an explicit [interface](./4_interfaces.md)

```fl
# math.fl
let add <- \(_0 + _1)
let multiply <- \(_0 * _1)
let math <- {add, multiply}
export math, {add, multiply}
```

```fl
# index.fl
import math, {add, multiply} from './math'

math.add 4 5 # 9
multiply 4 5 # 20
```

`exportSyntax` can export operators & multiple functions per namespace (via lists)

```fl
# math.fl
: Number => Number
let flipSign <-
Operator{~ __}, \(_ * -1)

: Number => Number
let inverse <-
Operator{__'}, \(1 / _)

let math <- (flipSign, inverse)
exportSyntax math
```

```fl
# index.fl
importSyntax math from './math'

~5 # -5
5' # 0.2
```

The module system looks in one of three locations depending on usage

```fl
import something from 'library' # node_modules
import something from './file'  # relative
import window                   # JS intertop
```
