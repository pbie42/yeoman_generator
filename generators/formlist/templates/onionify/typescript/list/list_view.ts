import { div, h1, h4, div, VNode } from '@cycle/dom'

import { Status } from "../../repo"
import { State } from '../interfaces';


export const view = ([<%= itemNameL %>list, state]:[Array<VNode>, { requests }]) => {
  return div([
    h1('<%= itemNameU %>'),
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
