# Streams

> In the [transactions guide](./7_transactions.md) you'll learn how to create streams via the JS intertop

```fl
# Creating streams

let stream <- ${1 2 3}
let counter <- interval 1000

# Mapping streams

stream -> \(_ * 2)      # ${2 4 6}
stream * 2              # ${2 4 6}
counter -> \(_, i), (i) # ${0 1 2 ...}

# Manipulating streams

$counter -> debounce 2000
counter $> debounce 2000

# Ending streams

counter $> buffer 5 $> end # ${0 1 2 3 4}

# Concatenation

$stream <- 20      # ${1 2 3 20}
stream <$ (10, 15) # ${1 2 3 20 10 15}
```

Streams can be treated like typical values. `$` gets the streaming identity of a value to, for example, filter & buffer events. `$>` is a shortcut for `-> $ ->`, useful in chains.

The reduce operator `<--` *copies* a value, & appends it to a list on the right.

```fl
let number <- 5
number <-- \(_ + 2)       # 7
number <- \(_ + 2) number # 7

let numbers <- ${1 2 3}
$numbers <-- \(_ + 4)     # ${1 2 3 7}
```
