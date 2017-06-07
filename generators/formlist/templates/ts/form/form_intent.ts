import { Stream } from 'xstream'

import { <% inputs.forEach(i => { %><%= i %>Change, <% }) %>submitFn, clear, edit, editFn } from './model'

import { log, bind } from './utils'

export default function intent({ DOM, HTTP }, reset, edits) {

  <% inputs.forEach(i => { %>
  const <%= i %>Ev:Stream<Event> = DOM.select('#<%= i %>').events('input')<% }) %>
  const submitEv:Stream<Event> = DOM.select('#submit').events('click')
  const editEv:Stream<Event> = DOM.select('#editSubmit').events('click')

  <% inputs.forEach(i => { %>
  const <%= i %> = <%= i %>Ev.map(ev => (ev.target as HTMLInputElement).value)
                             .map(<%= i %> => bind(<%= i %>Change, <%= i %>))<% }) %>

  const submit:Stream<Function> = submitEv.mapTo(submitFn)

  const editSubmit = editEv.mapTo(editFn)

  const actions = Stream.merge(<% inputs.forEach(i => { %><%= i %>, <% }) %>submit, reset.mapTo(clear), edits.map(data => bind(edit, data)), editSubmit)

  return { actions }
}
