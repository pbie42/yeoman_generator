import xs from 'xstream'
import { div, label, button, form } from '@cycle/dom'

import { textInput } from '../views'


const view = ([{ <%= itemNameL %> }, edit]) => {
    const { <% inputs.forEach(i => { %><%= i %>, <% }) %> } = <%= itemNameL %>
    console.log(`state:`, { <% inputs.forEach(i => { %><%= i %>, <% }) %> })
    return form({attrs: { onsubmit: "return false" }}, [<% inputs.forEach(i => { %>
      div([
        label({ attrs: { for: '#<%= i %>' } }, '<%= i %>'),
        textInput('#<%= i %>', <%= i %>)
      ]),<% }) %>
      edit ? button('#submit', 'Submit') : button('#editSubmit', 'Edit')
    ])}

export default view