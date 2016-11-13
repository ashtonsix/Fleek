export const streamStart = {
  name: 'streamStart',
  match: '${',
  onMatch: (match, program, context) => {
    context.push({name: 'stream'})
  },
}
