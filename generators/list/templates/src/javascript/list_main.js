import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import Collection from "../collections"

import { log, sample, bind } from './utils'
import <%= itemNameL %>Item from './item/_item'

import { model } from "./model"
import { intent } from "./intent"
import { view } from "./view"

export default function <%= name %>({ DOM, HTTP }) {

  const removeProxy = xs.create()

  const { actions, requests, add<%= itemNameU %>, <%= itemNameL %>RemoveSuccess } = intent({ DOM, HTTP }, removeProxy)
  const { states } = model(actions)

  const list<%= itemNameU %> = Collection(<%= itemNameL %>Item, { DOM }, add<%= itemNameU %>.map(<%= itemNameL %> => ({ <%= itemNameL %>: xs.of(<%= itemNameL %>) })), item => item.remove)
  const list<%= itemNameU %>Vtrees = Collection.pluck(list<%= itemNameU %>, item => item.DOM)
  const remove = Collection.merge(list<%= itemNameU %>, item => item.remove<%= itemNameU %>)

  removeProxy.imitate(remove)

  return {
    DOM: xs.combine(list<%= itemNameU %>Vtrees, states).map(view),
    HTTP: requests,
    history: xs.empty(),
  }
}
