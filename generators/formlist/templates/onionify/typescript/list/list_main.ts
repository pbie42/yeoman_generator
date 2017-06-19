import { Stream } from 'xstream'
import { VNode } from '@cycle/dom'
import Collection from "./collections"

import { log, sample, bind, mergeState } from './utils'
import <%= itemNameL %>Item from './item/_item'

import { model } from "./model"
import { intent } from "./intent"
import { view } from "./view"

import { Sources, ListSinks, ListState, ListIntent, State, ItemSinks, Data } from '../interfaces'

export default function List({ DOM, HTTP, onion }:Sources, new<%= itemNameU %>:Stream<State>, edit<%= itemNameU %>:Stream<State>):ListSinks {

  const state:Stream<State> = onion.state$

  const { actions, requests, add<%= itemNameU %> }:ListIntent = intent({ DOM, HTTP, onion }, new<%= itemNameU %>, edit<%= itemNameU %>)
  const { states }:{ states:Stream<ListState>} = model(actions)

  const list<%= itemNameU %>:Stream<Array<ItemSinks>> = Collection(<%= itemNameL %>Item, { DOM }, add<%= itemNameU %>.map(<%= itemNameL %> => ({ <%= itemNameL %>: Stream.of(<%= itemNameL %>) })), item => item.remove, edit<%= itemNameU %>)
  const list<%= itemNameU %>Vtrees:Stream<Array<VNode>> = Collection.pluck(list<%= itemNameU %>, item => item.DOM)
  const edits:Stream<Array<Data>> = Collection.merge(list<%= itemNameU %>, item => item.edits)

  return {
    DOM: Stream.combine(list<%= itemNameU %>Vtrees, states).map(view),
    HTTP: requests,
    onion: edits.map(data => bind(mergeState, { <%= itemNameL %>: data })),
    history: Stream.empty(),
    edits
  }
}
