import { input } from '@cycle/dom'

export const textInput = (cls, value) =>
  input(cls, { attrs: { type: 'text', value: value }, hook: {
    update: (vnode) => { vnode.elm.value = value }
  }})
