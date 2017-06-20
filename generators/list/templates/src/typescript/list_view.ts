import { div, h1, h4, VNode } from '@cycle/dom'

import { Status } from "../repo"
import { State, Data, ViewState } from './interfaces'

export const view = ([<%= itemNameL %>List, state]:[ Array<VNode>, ViewState ]):VNode => {
  console.log(`get<%= itemNameU %>`, state.requests.get<%= itemNameU %>)
  return div([
    h1('<%= itemNameU %>'),
    ...show<%= itemNameU %>(<%= itemNameL %>List, state.requests.get<%= itemNameU %>),
  ])
}

function show<%= itemNameU %>(<%= itemNameL %>List:Array<VNode>, status:{ status:string }):Array<VNode> {
  if (status === undefined) return [ h4('loading...') ]
  if (status === Status.pending) { return [ h4('loading...') ]}
  return  <%= itemNameL %>List
}
