export const operatorStart = {
  name: 'operatorStart',
  match: 'Operator{',
  onMatch: (match, program, context) => {
    context.push({name: 'operator'})
  },
}
