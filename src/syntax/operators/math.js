export const add = {name: 'add', precedence: 18, syntax: '__ + __', func: (v0, v1) => v0 + v1}
export const sub = {name: 'sub', precedence: 18, syntax: '__ - __', func: (v0, v1) => v0 - v1}
export const mul = {name: 'mul', precedence: 19, syntax: '__ * __', func: (v0, v1) => v0 * v1}
export const div = {name: 'div', precedence: 19, syntax: '__ / __', func: (v0, v1) => v0 / v1}
export default {add, sub, mul, div}
