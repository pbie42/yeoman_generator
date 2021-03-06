import { ul, h1, h4 } from '@cycle/dom'

import { Status } from "../repo"

export const view = ([<%= itemNameL %>list, state]) => {
  console.log(`get<%= itemNameU %>`, state.requests.get<%= itemNameU %>)
  return ul([
    h1('<%= itemNameU %>'),
    ...show<%= itemNameU %>(<%= itemNameL %>list, state.requests.get<%= itemNameU %>),
  ])
}

function show<%= itemNameU %>(<%= itemNameL %>list, status) {
  if (status === undefined) return [ h4('loading...') ]
  if (status === Status.pending) { return [ h4('loading...') ]}
  return  <%= itemNameL %>list
}
