import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http'
import { DOMSource, VNode } from '@cycle/dom'
import sampleCombine from 'xstream/extra/sampleCombine'
import Collection from "../../collections"

import { log, sample, bind } from './utils'
import <%= itemNameL %>Item from './item/_item'

import { model } from "./model"
import { intent } from "./intent"
import { view } from "./view"

import { ListSources, ListSinks, ListIntent, State } from '../interfaces'

export default function List({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> }:ListSources):ListSinks {

  const { actions, requests, add<%= itemNameU %>, <%= itemNameL %>EditSuccess }:ListIntent = intent({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> })
  const { states }:{ states:Stream<{}> } = model(actions)

  const list<%= itemNameU %>:Stream<Array<{}>> = Collection(<%= itemNameU %>Item, { DOM }, add<%= itemNameU %>.map(<%= itemNameL %> => ({ <%= itemNameL %>: Stream.of(<%= itemNameL %>) })), item => item.remove)
  const list<%= itemNameU %>Vtrees:Stream<Array<VNode>> = Collection.pluck(list<%= itemNameU %>, item => item.DOM)
  const edits:Stream<Array<State>> = Collection.merge(list<%= itemNameU %>, item => item.edits)

  const edit:Stream<State | String> = <%= itemNameU %>EditSuccess.compose(sampleCombine(edit<%= itemNameU %>)).map(([_, edit]) => edit)

  return {
    DOM: Stream.combine(list<%= itemNameU %>Vtrees, states, edit.startWith('')).map(view),
    HTTP: requests,
    history: Stream.empty(),
    edits
  }
}
