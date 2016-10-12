# Tensors

> Read the [array](./1_types.md#arrays) & [interface](./3_interfaces.md) guides if you haven't already.

A `Tensor` is a rectangular `Array` that contains only numbers & does high-performance computation.

```fl
# Creation

[1 2 3; 2 4 6]       # 1 2 3
                     # 2 4 6

reshape 2 3 1..6     # 1 2 3
                     # 4 5 6

zeros 2 3            # 0 0 0
                     # 0 0 0

ones 2 2 3           # [1 1 1] [1 1 1]
                     # [1 1 1] [1 1 1]

eye 3                # 1 0 0
                     # 0 1 0
                     # 0 0 1

# Scalars

[1 2; 2 4] + 2       # 3 4
                     # 4 6

[1 2; 2 4] * 2       # 2 4
                     # 4 8

# Vectors

[1 2; 2 4] .* [1; 2] # 1 2
                     # 4 8

[1 2; 2 4] + [0 5]   # 1 7
                     # 2 9

# Matrices

[1 2; 2 4] * [1; 2]  #  5
                     # 10

transpose [1 5; 2 4] # 1 2
                     # 5 4

inv [1 2; 2 3]       # -3  2
                     #  2 -1

pinv [1 2; 2 4]      # 0.04 0.08
                     # 0.08 0.16
```

You can safely use `map` & ranges with matrices.

```fl
1..6 ->
reshape 2 3 ->
map \(_ > 3)   # 0 0 0
               # 1 1 1

1..81 ->
reshape 9 9 ->
\(_. ..3 7..)  #  7  8  9
               # 16 17 18
               # 25 26 27

# Reducers

let matrix <- reshape 2 3 1..6

matrix -> min 1 # 1
                # 4

matrix -> max 0 # 4 5 6

matrix -> sum   # 21

matrix -> sum 0 # 5 7 9

```
