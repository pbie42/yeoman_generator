import { Stream } from 'xstream'
import { div, label, button, form, fieldset, legend, VNode } from '@cycle/dom'

import { textInput } from '../views'
import { State } from '../interfaces'

const view = ([ state, edit]:[ State, Boolean ]):VNode => {
  const { <% inputs.forEach(i => { %><%= i %>, <% }) %> } = state.<%= itemNameL %>
  console.log({ <% inputs.forEach(i => { %><%= i %>, <% }) %> })
  return form({attrs: { onsubmit: "return false" }}, [ 
    fieldset([
      legend("Form"),<% inputs.forEach(i => { %>
    div([
      label({ attrs: { for: '#<%= i %>' } }, '<%= i %>'),
      textInput('#<%= i %>', <%= i %>)
    ]),<% }) %>
    edit ? button('#submit', 'Submit') : button('#editSubmit', 'Edit')
    ])
  ])
}

export default view