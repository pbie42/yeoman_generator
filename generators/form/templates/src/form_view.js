import xs from 'xstream'
import { div, label, button, form } from '@cycle/dom'

import { textInput } from '../views'


const view = ({ {{#parts}}{{idName}}, {{/parts}} }) => {
  console.log({ {{#parts}}{{idName}}, {{/parts}} })
    return form({attrs: { onsubmit: "return false" }}, [
      {{#parts}}
      div([
        label({ attrs: { for: '#{{idName}}' } }, '{{idName}}'),
        textInput('#{{idName}}', {{idName}})
      ]),
      {{/parts}}
      button('#submit', 'Submit')
    ])}

export default view
