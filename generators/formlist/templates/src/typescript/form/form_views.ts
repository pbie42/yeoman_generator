import { input, VNode } from '@cycle/dom'

export const textInput = (cls, value):VNode =>
  input(cls, { attrs: { type: 'text', value: value }, hook: {
    update: (vnode) => { vnode.elm.value = value }
  }})
