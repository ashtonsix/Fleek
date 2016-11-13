# Streams

> In the [transactions guide](./7_transactions.md) you'll learn how to create streams via the JS intertop

Fleek uses streams for all events, you'll need streams for responding to clicks, timers, HTTP requests, whizzes, bangs, pops & the rest. A stream is a sequence of events.

Streams behave like the last value in the stream, whenever a new value is added to a stream functions / operators that accept the stream as an argument are re-called. Assigning to a stream appends new values. Ending a stream removes listeners & stops the stream growing.

To manipulate streams themselves you'll need the *streaming identity* (access via `$`) to, for example, throttle or filter events. `$>` is a shortcut for `-> $ ->`.

**Usage**

```fl
let stream <- ${1 2 3}
let counter <- interval 1000

stream -> \(_ * 2)      # ${2 4 6}
stream * 2              # ${2 4 6}
counter -> \(_, i), (i) # ${0 1 2 ...}

let doubles <- stream * 2
$stream <- 4
doubles      # ${2 4 6 8}

counter $>
  filter \(_ % 2) ->
  \(_ - 1) $>
  buffer 5 $> end    # ${0 2 4 6 8}
```

The reduce operator `<--` applies a function to an identity.

```fl
let number <- 5
@number <-- \(_ + 2)       # @number: 7

let numbers <- ${1 2 3}
$numbers <-- \(_ + 4)      # $numbers: ${1 2 3 7}
```
