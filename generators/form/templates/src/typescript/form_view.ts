import { Stream } from 'xstream'
import { div, label, button, form, fieldset, legend, VNode } from '@cycle/dom'

import { textInput } from './views'
import { State } from './interfaces'

const view = ({ <% inputs.forEach(i => { %><%= i %>, <% }) %> }:State):VNode => {
  console.log({ <% inputs.forEach(i => { %><%= i %>, <% }) %> })
  return form({attrs: { onsubmit: "return false" }}, [ 
    fieldset([
      legend("Form"),<% inputs.forEach(i => { %>
    div([
      label({ attrs: { for: '#<%= i %>' } }, '<%= i %>'),
      textInput('#<%= i %>', <%= i %>)
    ]),<% }) %>
    button('#submit', 'Submit')
    ])
  ])
}

export default view
