# Tensors

> Every `Tensor` is an `Array`, read the [interface guide](./3_interfaces.md) to understand this.

> You may find this [matrix multiplication tutorial](https://www.khanacademy.org/math/precalculus/precalc-matrices/multiplying-matrices-by-matrices/v/matrix-multiplication-intro) helpful.

A `Tensor` is a rectangular `Array` that contains only numbers & does high-performance computation.

```fl
# Creation

[1 2 3; 2 4 6]       # 1 2 3
                     # 2 4 6

zeros 2 3            # 0 0 0
                     # 0 0 0

ones 2 3             # 1 1 1
                     # 1 1 1

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

transpose [1 5; 2 4; 6 8] # 1 2 6
                          # 5 4 8

inv [1 2; 2 3]       # -3  2
                     #  2 -1

pinv [1 2; 2 4]      # 0.04 0.08
                     # 0.08 0.16
```

You can safely use `map` & ranges with matrices.

```fl

```
