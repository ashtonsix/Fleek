export const ternaryStart = {
  name: 'ternaryStart',
  match: '?',
  onMatch: (match, program, context) => {
    context.push({name: 'ternary'})
  },
}
