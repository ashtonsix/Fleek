export const functionStart = {
  name: 'functionStart',
  match: '\\(',
  onMatch: (match, program, context) => {
    context.push({name: 'function'})
    // TODO
    context.push({name: 'functionArguments' || 'functionBody'})
  },
}
