import { Stream } from 'xstream'
import isolate from '@cycle/isolate'
import { div, VNode } from '@cycle/dom'
import { assign } from './utils'


import <%= formName %> from './<%= formName %>/_<%= formName %>'
import <%= listName %> from './<%= listName %>/_<%= listName %>'

import { Sources, Sinks, FormSinks, ListSinks, Reducer, State } from './interfaces'

export default function app({DOM, HTTP, onion }:Sources):Sinks {

  const editsProxy:Stream<{}> = Stream.create().startWith('')

  const initReducer:Stream<Reducer> = Stream.of(function initReducer(prevState):State {
    return { <%= itemNameL %>: { <% inputs.forEach(i => { %><%= i %>: '', <% }) %> } } // this is the initial state
  })

  const formListLens:{ get: Function, set: Function} = {
    get: state => ({ <%= itemNameL %>: state.<%= itemNameL %> }),
    set: (state, childState) => (assign({}, state, { <%= itemNameL %>: childState.<%= itemNameL %> }))
  }

  const form:FormSinks = isolate(betterForm, { onion: formListLens })({ DOM, HTTP, onion }, editsProxy)
  const list = isolate(betterList, { onion: formListLens })({ DOM, HTTP, onion }, form.new<%= itemNameU %>, form.edit<%= itemNameU %>)

  const reducer = Stream.merge(initReducer, form.onion, list.onion)
  const view = ([form, list]:Array<{}>):VNode => div([ form, list ])

  editsProxy.imitate(list.edits)

  return {
    DOM: Stream.combine(form.DOM, list.DOM).map(view),
    HTTP: list.HTTP,
    history: Stream.empty(),
    onion: reducer
  }
}
