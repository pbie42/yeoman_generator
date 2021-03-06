import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import Collection from "../collections"

import { log, sample, bind } from '../utils'
import <%= itemNameL %>Item from './item/_item'

import { model, Status } from "./model"
import { intent } from "./intent"
import { view } from "./view"

export default function List({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> }) {

  const { actions, requests, add<%= itemNameU %> } = intent({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> })
  const { states } = model(actions)

  const list<%= itemNameU %> = Collection(<%= itemNameL %>Item, { DOM }, add<%= itemNameU %>.map(<%= itemNameL %> => ({ <%= itemNameL %>: xs.of(<%= itemNameL %>) })), item => item.remove, edit<%= itemNameU %>)
  const list<%= itemNameU %>Vtrees = Collection.pluck(list<%= itemNameU %>, item => item.DOM)
  const edits = Collection.merge(list<%= itemNameU %>, item => item.edits)

  return {
    DOM: xs.combine(list<%= itemNameU %>Vtrees, states).map(view),
    HTTP: requests,
    history: xs.empty(),
    edits
  }
}
