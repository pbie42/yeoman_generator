import { Stream } from 'xstream'
import { div, label, button, form, VNode } from '@cycle/dom'

import { textInput } from './views'
import { State } from './interfaces'

const view = ({ name, email, password,  }: State): VNode => {
  console.log({ name, email, password,  })
    return form({attrs: { onsubmit: "return false" }}, [
      div([
        label({ attrs: { for: '#name' } }, 'name'),
        textInput('#name', name)
      ]),
      div([
        label({ attrs: { for: '#email' } }, 'email'),
        textInput('#email', email)
      ]),
      div([
        label({ attrs: { for: '#password' } }, 'password'),
        textInput('#password', password)
      ]),
      button('#submit', 'Submit')
    ])}

export default view
