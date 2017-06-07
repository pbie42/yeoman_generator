import { div, h1, h4, VNode } from '@cycle/dom'

import { Status } from "../../repo"

export const view = ([peoplelist, state, edit]) => {
  return div([
    h1('Users'),
    ...showPeople(peoplelist, state.requests.getPeople),
    showSaving(state.requests.savePeople)
  ])
}

function showPeople(peoplelist, status):Array<VNode> {
  if (status === undefined) return [ h4('loading...') ]
  if (status === Status.pending) { return [ h4('loading...') ]}
  return peoplelist
}

function showSaving(status):VNode {
  if (status === undefined) return div( )
  if (status === Status.pending) { return h4('adding people...')}
  return div()
}
