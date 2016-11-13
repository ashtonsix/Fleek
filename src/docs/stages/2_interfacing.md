# Interfacing

By this point we have a lot of information about our program, but there's a lot we don't know. The biggest problem is we don't know what each ID refers to, we could be dealing with functions, numbers, any type essentially.

Let's define an interface for each identity & function.

### Stage 1

Evaluate native list-rearranging operators like flow right `->` & flow left `<-` at compile time to simplify program.

Resolve natively defined IDs like `let` & `return`.

```js
'(OPERATOR@<- (ID@let (ID@Counter), FUNCTION@( ... )))' =>
'(FUNCTION@let (ID@Counter, FUNCTION@( ... )))'
```

### Stage 2

Identify each assignment and store it's location as a path:

```js
`(FUNCTION@let (ID@fifty, NUMBER@50))` =>
{fifty: ['0.1.1']} // 'NUMBER@50'
```

For each ID reference (any non-assignment), classify as:

* No value assigned - Replace with empty list
* One possibility - Link reference to assignment
* Multiple possibilities - Leave symbol alone (Can we do more?)

```js
{
  assignments: {fifty: ['0.1.1']}
  program: `(
    FUNCTION@let (ID@fifty, NUMBER@50),
    OPERATOR@+ (ID@fifty:0.1.1, NUMBER@5)
  )`
}
```

### Stage 3

We can start generating interfaces.
