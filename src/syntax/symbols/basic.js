const numberRegex = /(?:- *)?(?:0|(?:[1-9][0-9]*))/

// examples: 'NaN', '-6', '20'
export const number = {
  name: 'number',
  match: ['NaN', numberRegex],
}

export const placeholder = {
  name: 'placeholder',
  match: '__'
}

export const range = {
  name: 'range',
  match: (() => {
    const num = `(?:${numberRegex.toString().slice(1, -1)})`
    return new RegExp(`${num}?\\.\\.${num}?`)
  })()
}

export const id = {
  name: 'id',
  testAfterOperators: true,
  match: [/[a-z_`][a-z0-9_$`]*/i, '$']
}
