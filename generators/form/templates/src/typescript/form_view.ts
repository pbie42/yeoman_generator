import { Stream } from 'xstream'
import { div, label, button, form, VNode } from '@cycle/dom'

import { textInput } from './views'
import { State } from './interfaces'

const view = ({ <% inputs.forEach(i => { %><%= i %>, <% }) %> }: State): VNode => {
  console.log({ <% inputs.forEach(i => { %><%= i %>, <% }) %> })
    return form({attrs: { onsubmit: "return false" }}, [<% inputs.forEach(i => { %>
      div([
        label({ attrs: { for: '#<%= i %>' } }, '<%= i %>'),
        textInput('#<%= i %>', <%= i %>)
      ]),<% }) %>
      button('#submit', 'Submit')
    ])}

export default view
