import xs from 'xstream'

import { <% inputs.forEach(i => { %><%= i %>Change, <% }) %>submitFn, clear, edit, editFn } from './model'

import { log, bind } from '../utils'

export default function intent(sources, reset, edits) {

  <% inputs.forEach(i => { %>
  const <%= i %> = sources.DOM.select('#<%= i %>').events('input')
                             .map(ev => ev.target.value)
                             .map(<%= i %> => bind(<%= i %>Change, <%= i %>))<% }) %>

  const submit = sources.DOM.select('#submit').events('click')
                             .mapTo(submitFn)

  const editSubmit = sources.DOM.select('#editSubmit').events('click')
                             .mapTo(editFn)

  const actions = xs.merge(<% inputs.forEach(i => { %><%= i %>, <% }) %>submit, reset.mapTo(clear), edits.map(data => bind(edit, data)), editSubmit)

  return { actions }
}
