import xs from 'xstream'
import isolate from '@cycle/isolate'
import { div, h1 } from '@cycle/dom'

import <%= formName %> from './<%= formName %>/_<%= formName %>'
import <%= listName %> from './<%= listName %>/_<%= listName %>'

import { assign } from '../utils'

export default function app(sources) {

  const editsProxy = xs.create().startWith('')

  const initReducer = xs.of(function initReducer(prevState) {
    return { <%= itemNameL %>: { <% inputs.forEach(i => { %><%= i %>: '', <% }) %> } } // this is the initial state
  })

  const formListLens = {
    get: state => ({ <%= itemNameL %>: state.<%= itemNameL %> }),
    set: (state, childState) => (assign({}, state, { <%= itemNameL %>: childState.<%= itemNameL %> }))
  }

  const form = isolate(<%= formName %>, { onion: formListLens })(sources, editsProxy)
  const list = isolate(<%= listName %>, { onion: formListLens })(sources, form.new<%= itemNameU %>, form.edit<%= itemNameU %>)

  const view = ([form, list]) => div([ form, list ])
  const reducer = xs.merge(initReducer, form.onion, list.onion)

  editsProxy.imitate(list.edits)

  return {
    DOM: xs.combine(form.DOM, list.DOM).map(view),
    HTTP: list.HTTP,
    history: xs.empty(),
    onion: reducer,
  }
}
