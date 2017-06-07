import { Stream } from 'xstream'
import { div, label, button, form, VNode } from '@cycle/dom'

import { textInput } from './views'

import { State } from './model'

const view = ([{ <% inputs.forEach(i => { %><%= i %>, <% }) %> }, edit]):VNode => {
  console.log({ <% inputs.forEach(i => { %><%= i %>, <% }) %> })
    return form({attrs: { onsubmit: "return false" }}, [<% inputs.forEach(i => { %>
      div([
        label({ attrs: { for: '#<%= i %>' } }, '<%= i %>'),
        textInput('#<%= i %>', <%= i %>)
      ]),<% }) %>
      edit ? button('#submit', 'Submit') : button('#editSubmit', 'Edit')
    ])}

export default view
