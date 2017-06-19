import xs from 'xstream'
import { div, label, button, form } from '@cycle/dom'

import { textInput } from '../views'

const view = ({ name, email, password,  }) => {
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
