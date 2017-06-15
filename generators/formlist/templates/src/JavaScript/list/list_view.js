import { div, h1, h4 } from '@cycle/dom'

import { Status } from "../repo"

export const view = ([<%= itemNameL %>list, state]) => {
  return div([
    h1('<%= itemNameU %>'),
    ...show<%= itemNameU %>(<%= itemNameL %>list, state.requests.get<%= itemNameU %>),
    showSaving(state.requests.save<%= itemNameU %>)
  ])
}

function show<%= itemNameU %>(<%= itemNameL %>list, status) {
  if (status === undefined) return [ h4('loading...') ]
  if (status === Status.pending) { return [ h4('loading...') ]}
  return  <%= itemNameL %>list
}

function showSaving(status) {
  if (status === undefined) return div( )
  if (status === Status.pending) { return h4('adding <%= itemNameL %>...')}
  return  div()
}
