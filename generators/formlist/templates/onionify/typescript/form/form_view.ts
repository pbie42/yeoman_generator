import { Stream } from 'xstream'
import { div, label, button, form, VNode } from '@cycle/dom'

import { textInput } from '../../views'
import { State } from '../interfaces'

const view = ([ state, edit]:[ State, Boolean ]):VNode => {
  const { <% inputs.forEach(i => { %><%= i %>, <% }) %> } = state.<%= itenNameL %>
  console.log({ name, type, color,  })
    return form({attrs: { onsubmit: "return false" }}, [<% inputs.forEach(i => { %>
      div([
        label({ attrs: { for: '#<%= i %>' } }, '<%= i %>'),
        textInput('#<%= i %>', <%= i %>)
      ]),<% }) %>
      edit ? button('#submit', 'Submit') : button('#editSubmit', 'Edit')
    ])}

export default view
