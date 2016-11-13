export const interfaceStart = {
  name: 'interfaceStart',
  match: '\\{',
  onMatch: (match, program, context) => {
    context.push({name: 'interface'})
  },
}

export const interfaceAssignmentStart = {
  name: 'interfaceAssignmentStart',
  match: (program, context) => {
    // match colon if it's the first non-space on a line
    for (let i = context.index; i >= 0; i--) {
      if (program[i] === '\n') return ':'
      if (program[i] !== ' ') break
    }
    return null
  },
  onMatch: (match, program, context) => {
    context.push({name: 'interfaceAssignment'})
  },
}
