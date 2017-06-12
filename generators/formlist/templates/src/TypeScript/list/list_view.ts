import { div, h1, h4, VNode } from '@cycle/dom'

import { Status } from "./repo"
import { State } from './interfaces';


export const view = ([<%= itemNameL %>list, state, edit]:[Array<VNode>, { requests }, State | String]) => {
  return div([
    h1('Users'),
    ...show<%= itemNameU %>(<%= itemNameL %>list, state.requests.get<%= itemNameU %>),
    showSaving(state.requests.save<%= itemNameU %>)
  ])
}

function show<%= itemNameU %>(<%= itemNameL %>list:Array<VNode>, status:{}):Array<VNode> {
  if (status === undefined) return [ h4('loading...') ]
  if (status === Status.pending) { return [ h4('loading...') ]}
  return <%= itemNameL %>list
}

function showSaving(status:{}):VNode {
  if (status === undefined) return div( )
  if (status === Status.pending) { return h4('adding <%= itemNameL %>...')}
  return div()
}
