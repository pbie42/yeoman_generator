import { div, h1, h4, VNode } from '@cycle/dom'

import { Status } from "./repo"
import { State, Data, ViewState } from './interfaces'

export const view = ([<%= itemNameL %>list, state]:[ Array<VNode>, ViewState ]):VNode => {
  console.log(`getPhone`, state.requests.get<%= itemNameU %>)
  return div([
    h1('<%= itemNameU %>'),
    ...show<%= itemNameU %>(<%= itemNameL %>list, state.requests.get<%= itemNameU %>),
  ])
}

function show<%= itemNameU %>(<%= itemNameL %>list:Array<VNode>, status:{ status:string }):Array<VNode> {
  if (status === undefined) return [ h4('loading...') ]
  if (status === Status.pending) { return [ h4('loading...') ]}
  return  <%= itemNameL %>list
}
