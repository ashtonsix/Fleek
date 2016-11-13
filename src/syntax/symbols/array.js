export const arrayStart = {
  name: 'arrayStart',
  match: '[',
  onMatch: (match, program, context) => {
    context.push({name: 'array'})
  },
}

export const arrayEnd = {
  name: 'arrayStart',
  match: ']',
  onMatch: (match, program, context) => {
    context.pop()
  },
}
