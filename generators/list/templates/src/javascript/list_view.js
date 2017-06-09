import { div, h1, h4 } from '@cycle/dom'

import { Status } from "../repo"

export const view = ([phoneslist, state]) => {
  return div([
    h1('Users'),
    ...showPhones(phoneslist, state.requests.getPhones),
    showSaving(state.requests.savePhones)
  ])
}

function showPhones(phoneslist, status) {
  if (status === undefined) return [ h4('loading...') ]
  if (status === Status.pending) { return [ h4('loading...') ]}
  return  phoneslist
}

function showSaving(status) {
  if (status === undefined) return div( )
  if (status === Status.pending) { return h4('adding phones...')}
  return  div()
}
