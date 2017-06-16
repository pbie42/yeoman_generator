import { Stream } from 'xstream'
import { div, label, button, form, VNode } from '@cycle/dom'

import { textInput } from '../../views'
import { State } from '../interfaces'

const view = ([ state, edit]:[ State, Boolean ]):VNode => {
  const { name, type, color,  } = state.pets
  console.log({ name, type, color,  })
    return form({attrs: { onsubmit: "return false" }}, [
      div([
        label({ attrs: { for: '#name' } }, 'name'),
        textInput('#name', name)
      ]),
      div([
        label({ attrs: { for: '#type' } }, 'type'),
        textInput('#type', type)
      ]),
      div([
        label({ attrs: { for: '#color' } }, 'color'),
        textInput('#color', color)
      ]),
      edit ? button('#submit', 'Submit') : button('#editSubmit', 'Edit')
    ])}

export default view
