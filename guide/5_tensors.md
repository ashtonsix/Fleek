# Tensors

> Read the [array](./1_types.md#arrays) & [interface](./3_interfaces.md) guides if you haven't already.

Browsers (via JavaScript) have great performance in the general case, but can't match other languages in specific niches. Python (via NumPy) & Octave both have high-performance multi-dimensional arrays (tensors) that use GPU acceleration, multi-threading, vectorization, hand-optimized assembly, etc. yielding ~30x speed improvements & form the backbone of scientific computing.

The web supports some of this stuff, but only through obtuse technologies like PNacl, WebCL, asm.js, webAssembly, etc. that are often specific to one browser. Tensors abstract over them to close the performance gap & make scientific computing viable on the web.

## Usage

A `Tensor` is a rectangular `Array` that contains only numbers & does high-performance computation.

**Creation**

```fl
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
```

**Scalars**

```fl
[1 2; 2 4] + 2       # 3 4; 4 6

[1 2; 2 4] * 2       # 2 4; 4 8
```

**Vectors**

```fl
[1 2; 2 4] .* [1; 2] # 1 2; 4 8

[1 2; 2 4] + [0 5]   # 1 7; 2 9
```

**Matrices**

```fl
[1 2; 2 4] * [1; 2]  # 5; 10

transpose [1 5; 2 4] # 1 2; 5 4

inv [1 2; 2 3]       # -3 2; 2 -1

pinv [1 2; 2 4]      # 0.04 0.08; 0.08 0.16
```

**Mapping**

```fl
[1 2 3; 4 5 6] ->
map \(_ > 3)      # 0 0 0; 1 1 1
```

**Ranges**

```fl
let m <- 1..81 -> reshape 9 9

m. (..3 7..)   #  7  8  9
               # 16 17 18
               # 25 26 27
```

**Reducing**

```fl
let m <- [1 2 3; 4 5 6]

m -> max 0 # 4 5 6

m -> min 1 # 1; 4

m -> sum   # 21

m -> sum 0 # 5 7 9
```
