export const stringStart = {
  name: 'stringStart',
  match: [`'`, `"`],
  onMatch: (match, program, context) => {
    context.push({name: 'string', meta: {quoteType: match.value}})
  },
}
