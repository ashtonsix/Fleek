# Logical Types

## Descriptors

## Ranges

Ranges can be used to create, slice, splice & concatenate arrays.

Creation

```fl
> 0..4
0 1 2 3 4
> 0..2..8
0 2 4 6 8
> Array (2 5..3)
5 4 3
5 4 3
```

Slice & splice

```fl
> let names <- ['Jessica' 'Rakesh' 'Tim' 'Rihanna']
@names: Array
> names.(..-1)
'Jessica' 'Rakesh' 'Tim'
> names.(0..2..)
'Jessica' 'Tim'
> names.(1..2)
'Rakesh' 'Tim'
> names.(:'Prabdeep')
'Jessica' 'Rakesh' 'Tim' 'Rihanna' 'Prabdeep'
> names.(..1:():2..)
'Jessica' 'Tim' 'Rihanna'
```

Across multiple dimensions

```fl
> let numbers <- Array (0..3 0..3)
@numbers: Array
> numbers
0 1 2 3
1 2 3 4
2 3 4 5
3 4 5 6
> numbers.(1..2 1..)
2 3 4
3 4 5
```
