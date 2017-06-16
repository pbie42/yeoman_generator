import { div, h1, h4, VNode } from '@cycle/dom'

import { Status } from "../../repo"
import { State } from '../interfaces';


export const view = ([petslist, state]:[Array<VNode>, { requests }]) => {
  return div([
    h1('Users'),
    ...showPets(petslist, state.requests.getPets),
    showSaving(state.requests.savePets)
  ])
}

function showPets(petslist:Array<VNode>, status:{}):Array<VNode> {
  if (status === undefined) return [ h4('loading...') ]
  if (status === Status.pending) { return [ h4('loading...') ]}
  return petslist
}

function showSaving(status:{}):VNode {
  if (status === undefined) return div( )
  if (status === Status.pending) { return h4('adding pets...')}
  return div()
}
