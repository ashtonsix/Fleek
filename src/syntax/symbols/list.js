export const listStart = {
  name: 'listStart',
  match: (program, context) => {
    return ['(', new RegExp(`\\n {${context.indent + 1},}`)]
  },
  onMatch: (match, program, context) => {
    context.push({name: 'list'})
  },
}

export const listSibling = {
  name: 'listSibling',
  match: (program, context) => {
    return [',', new RegExp(`\\n {${context.indent}}`)]
  },
  onMatch: (match, program, context) => {
    context.sibling()
  }
}

export const listEnd = {
  name: 'listEnd',
  match: (program, context) => {
    const whitespace = `\\n{0,${context.indent - 1}}`
    return new RegExp(`(,|${whitespace})`)
  },
  onMatch: (match, program, context) => {
    context.pop()
    context.try((p, context) => {
      if (context.name === 'list') {
        return {name: 'contextEnd', location: match.startIndex}
      }})
  }
}
