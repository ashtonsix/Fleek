# Compiling

> These are rough notes for implementing a compiler, you can stop reading now.

## Formats

Fleek can output one of two formats:

* annotated S-expressions (intermediate, for alternative runtimes)
* compiled JavaScript code

## Parsing

### Stage 1

Fleek is a Chomsky level 0 language so typical approaches to parsing won't work. First define our symbol sets & ensure operators have no syntax overlaps, as described in the [operators guide](./8_operators.md#). We skip tokenization altogether & create a proto AST like so:

```fl
let reducer <- ${1}
```

```js
// example accumulator status:
//   at 0,16:
//     protoAST:         {}
//     symbolBuffer:     {value: '$', candidates: ['ID@$', 'STREAM_START@${']}
//     expressionBuffer: {value: ['ID@let', 'ID@reducer', 'OP@<-'], candidates: ['VALUE@__']}
//     contextStack:     [{type: 'default'}]
//   at 0,18:
//     protoAST:         {}
//     symbolBuffer:     {value: '1', candidates: ['NUMBER@1__']}
//     // when NUMBER@1_ is ended by '}' candidates are replaced with: ['VALUE@__', 'OP@__', 'NEXT@,', 'STREAM_END@}']
//     // all but 'STREAM_END@}' are invalidated, ending the context, it's popped from the contextStack &
//     // appended to the protoAST
//     expressionBuffer: {value: [], candidates: ['VALUE@__']}
//     contextStack:     [
//                          {type: 'default', expression: {value: ['ID@let', 'ID@reducer', 'OP@<-'], candidates: ['STREAM@__']}},
//                          {type: 'stream'}
//                       ]
//   at 0,19:
//     protoAST:         {'0,15:0,19': {type: 'stream', expressions: [['NUMBER@1']]}}
//     symbolBuffer:     {value: '', candidates: ['END@', 'VALUE@__']}
//     expressionBuffer: {value: ['ID@let', 'ID@reducer', 'OP@<-', 'STREAM@0,15:0,19'], candidates: ['END@__', 'NEXT@__', 'VALUE@__', 'OP@__']}
//     contextStack:     [{type: 'default'}]
//
// `parseStage1(program).protoAST` example:
//   0,0:0,19:  {type: 'default', expressions: [['ID@let', 'ID@reducer', 'OP@<-', 'STREAM@0,15:0,19']]}
//   0,15:0,19: {type: 'stream',  expressions: [['NUMBER@1']]}
program.split('').reduce(({protoAST, symbolBuffer, expressionBuffer, contextStack}, char) => { /* ... */ })
```

> Note: `WHITESPACE` symbols, range accounting & operator have been ommitted for brevity

Example symbol definitions:

```js
NUMBER: /(NaN|(?:- *)?(?:0|(?:[1-9][0-9]*)))/ // matches ['NaN', '0', '-32']
PLACEHOLDER: '__'
OP: '<-' or '<--' or ... // (the user-defined operator 'for __ in __' contains OP instances 'for' & 'in')
ID: (/[a-z_][a-z0-9_]*/i or '$') and not (PLACEHOLDER or OP or 'Interface' or ...)
VALUE: NUMBER or PLACEHOLDER or ID or STREAM or ...
```

Symbol definitions can vary between contexts, `:` is an `ID` in the default context & an `OP` in the ternary context.

Expression candidates can have multiple symbols: given the expression `['OP@for']`, `VALUE@__ OP@in VALUE@__` may be a possible candidate.

Context start symbols aren't always enough to identify the current context. For example `FUNCTION_PART_1_START` (`\(`) could indicate either the start of a function body or argument set, we need to look ahead & see whether the `FUNCTION_PART_1_END` is followed by a comma `,`.

**How it works**:

The `symbolBuffer` eats charachters invalidating candidate symbols (from pool defined by context) until the last candidate is completed or invalidated. The symbol is valid if:

1. There was one candidate left & it was completed
2. The remaining candidates are invalidated, but the buffer content matches *one* of those candidates (e.g: `2}` when invalidated by `}` has buffer `2` which matches `NUMBER`, the only candidate)
3. (`OP` only) There are multiple candidates, which are simultaneously eliminated, but one symbol can be picked based on list order (described in [operator guide](./8_operators.md)) if either #1 or #2 passes

Compilation stops if all candidates are eliminated & the symbol is invalid.

> The `expressionBuffer` also stores the index of the currently considered operator (ommitted from example)

The `expressionBuffer` eats symbols from the `symbolBuffer`. It's candidates depend on the previous symbol (the context describes which symbols can follow others), candidates can be further restricted by the current operator (to a specific `OP` or any `VALUE`).

The `expressionBuffer` stops eating when:

1. Invalid symbol eaten (stops compiling)
2. Next / sibling symbol eaten (`expressionBuffer` emptied to `protoAST`, siblings are grouped into single nodes)
3. Context end symbol eaten, (emptied to `protoAST` as in #2. `contextStack` is popped to `expressionBuffer` & context pointer symbol is eaten)

If the `expressionBuffer` eats a context start symbol the `expressionBuffer` is temporarily stored on the `contextStack` & emptied.

**More examples**:

```fl
let Counter <- \(state), (
  div
    button {onClick: \($reducer <-- \(_ + 1))} '+'
    div state
)
```

```js
{
  '0,0:4,1':   {type: 'default',  expressions: [['ID@let', 'ID@Counter', 'OP@<-', 'FUNCTION@0,15:4,1']]},
  '0,15:4,1':  {type: 'function', expressions: [['FUNCTION_ARGUMENTS@0,15:0:23', 'FUNCTION_BODY@0,23:4,1']]},
  '0,15:0,23': {type: 'functionArguments': expressions: [['ARGUMENT_KEY@state']]},
  '0,23:4,1':  {type: 'default',  expressions: [['ID@div', 'DEFAULT@2,4:4,0']]},
  '2,4:4,0':   {type: 'default',  expressions: [['ID@button', 'OBJECT@2,11:2,46', 'STRING@2,47:2,50'], ['ID@div', 'ID@state']]},
  '2,11:2,46': {type: 'object',   expressions: [['OBJECT_KEY@onClick', 'FUNCTION_BODY@2,21:2,45']]},
  '2,21:2,45': {type: 'default',  expressions: [['ID@$', 'ID@reducer', 'OP@<--', 'FUNCTION_BODY@2,36:2,44']]}
  '2,36:2,44': {type: 'default',  expressions: [['ID@_', 'OP@+', 'NUMBER@1']]}
  '2,47:2,50': {type: 'string',   expressions: [['CONTENT@+']]}
}
```

```fl
let Node <-
Interface
\{
  Map
  name: String
  id: String
  \(length _.id): equalTo 10
  \(allRemaining _): Any
}
```

```js
{
  // If keys overlapped they could be '0_0,0:8,1' & '1_0,0:8,1'
  '0,0:8,1': {type: 'default',   expressions: [['ID@let', 'ID@Node', 'OP@<-', 'INTERFACE@1,0:8,1']]},
  '1,0:8,1': {type: 'interface', expressions: [
    ['ID@let'],
    ['INTERFACE_KEY@name', 'ID@String'],
    ['INTERFACE_KEY@id', 'ID@String'],
    ['INTERFACE_FUNCTION_KEY@6,2:6,15', 'ID@equalTo', 'NUMBER@10'],
    ['INTERFACE_FUNCTION_KEY@7,2:7,19', 'ID@Any'],
  ]},
  '6,2:6,15': {type: 'default', expressions: [['ID@length', 'ID@_', 'OP@.', 'ID@id']]},
  '7,2:7,19': {type: 'default', expressions: [['ID@allRemaining', 'ID@_']]},
}
```

### Stage 2

Next we resolve operator associativity for each expression. Starting with the lowest precedence operators we can recursively nest the symbols. Symbols collapse left so we create a "full nesting". Convert symbol-based expressions into S-expressions. Then inline linked expressions.

```js
['ID@let', 'ID@Counter', 'OP@<-', 'FUNCTION@0,15:4,1'] =>
['OP@<-', [['ID@let', 'ID@Counter'], ['FUNCTION@0,15:4,1']]] =>
['OP@<-', [['ID@let', ['ID@Counter']], ['FUNCTION@0,15:4,1']]] =>
'(OPERATOR@<- (ID@let (ID@Counter), FUNCTION@0,15:4,1))' =>
'(OPERATOR@<- (ID@let (ID@Counter), FUNCTION@( ... )))'
```

### Stage 3

By this point we have a lot of information about our program, but there's a lot we don't know: id's could be any kind of value, we don't know where our function calls are, operators are in superpositions, and so on. Stage 3 includes many incremental steps.


#### #1

Some native operators like flow right `->` & flow left `<-` can be evaluated at compile time because they only have one possible result.

Some ID symbols like `let` & `return` can't be overwritten by user-definitions so we can also resolve these now.

```js
'(OPERATOR@<- (ID@let (ID@Counter), FUNCTION@( ... )))' =>
'(FUNCTION@let (ID@Counter, FUNCTION@( ... )))'

`(OPERATOR@+ (NUMBER@4, NUMBER@2))` =>
`(NUMBER@6)`
```

#### #2

For each ID symbol, check for declarations/assignments in previous siblings/parents, sort into:

* No declarations - create identity for native value or `()` if none found
* "Maybe" declarations - found re-assignments inside functions or conditional context
* Definite declarations - no "maybe" declarations, store each identity declaration

```js
`(FUNCTION@let (ID@fifty, NUMBER@50),
  OPERATOR@+ (ID@fifty, NUMBER@5))` =>
{
  identities: {fifty: ['0,1,1']} // path to 'NUMBER@50'
}
```

Go back to the step 1, treating identities as values in place where possible & updating identity paths if needed.

```js
`(FUNCTION@let (ID@fifty, NUMBER@50), NUMBER@55)`
```

#### #3

We've simplified our program, can grab interfaces for all native functions & operators (ignore user-defined interfaces for now as we may end up disproving them later) & start generating interfaces for the rest of our program with a depth-first-search.
