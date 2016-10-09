Native fleek code can't do anything in practice except heat up your CPU. Actually doing anything requires importing from the JavaScript interop.
Things get done when lists collapse into transactions: a type of function that can run side-effects.

You can also write unsafe code (mutable types, inconsistent functions / identifiers) & interact directly with JavaScript by using transactions. Transactions are isolated functions that cannot interact with the application other than by returning values. The type system cannot prove anything about transactions so you'll need to add assertions manually.
