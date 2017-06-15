import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http'
import { DOMSource, VNode } from '@cycle/dom'
import sampleCombine from 'xstream/extra/sampleCombine'
import Collection from "./collections"

import { log, sample, bind } from './utils'
import <%= itemNameL %>Item from './item/_item'

import { model } from "./model"
import { intent } from "./intent"
import { view } from "./view"

import { ListSources, ListSinks, ListState, ListIntent, State, ItemSinks, Data } from '../interfaces'

export default function List({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> }:ListSources):ListSinks {

  const { actions, requests, add<%= itemNameU %> }:ListIntent = intent({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> })
  const { states }:{ states:Stream<ListState>} = model(actions)

  const list<%= itemNameU %>:Stream<Array<ItemSinks>> = Collection(<%= itemNameL %>Item, { DOM }, add<%= itemNameU %>.map(<%= itemNameL %> => ({ <%= itemNameL %>: Stream.of(<%= itemNameL %>) })), item => item.remove, , edit<%= itemNameU %>)
  const list<%= itemNameU %>Vtrees:Stream<Array<VNode>> = Collection.pluck(list<%= itemNameU %>, item => item.DOM)
  const edits:Stream<Array<Data>> = Collection.merge(list<%= itemNameU %>, item => item.edits)

  return {
    DOM: Stream.combine(list<%= itemNameU %>Vtrees, states).map(view),
    HTTP: requests,
    history: Stream.empty(),
    edits
  }
}
