import xs from 'xstream'
import Collection from "../collections"

import { bind, mergeState } from '../utils'
import <%= itemNameL %>Item from './item/_item'

import { model } from "./model"
import { intent } from "./intent"
import { view } from "./view"

export default function List({ DOM, HTTP, onion }, new<%= itemNameU %>, edit<%= itemNameU %>) {

  const state = onion.state$

  const { actions, requests, add<%= itemNameU %> } = intent({ DOM, HTTP }, new<%= itemNameU %>, edit<%= itemNameU %>)
  const { states } = model(actions)

  const list<%= itemNameU %> = Collection(<%= itemNameL %>Item, { DOM }, add<%= itemNameU %>.map(<%= itemNameL %> => ({ <%= itemNameL %>: xs.of(<%= itemNameL %>) })), item => item.remove, edit<%= itemNameU %>)
  const list<%= itemNameU %>Vtrees = Collection.pluck(list<%= itemNameU %>, item => item.DOM)
  const edits = Collection.merge(list<%= itemNameU %>, item => item.edits)

  return {
    DOM: xs.combine(list<%= itemNameU %>Vtrees, states).map(view),
    onion: edits.map(data => bind(mergeState, { <%= itemNameL %>: data })),
    HTTP: requests,
    history: xs.empty(),
    edits
  }
}