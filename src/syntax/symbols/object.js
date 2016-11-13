export const objectStart = {
  name: 'objectStart',
  match: '{',
  onMatch: (match, program, context) => {
    context.push({name: 'object'})
  },
}
