import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource, VNode } from '@cycle/dom';
import sampleCombine from 'xstream/extra/sampleCombine'
import Collection from "../collections"

import { log, sample, bind } from '../utils'
import <%= itemNameL %>Item from './item/_item'

import { model } from "./model"
import { intent } from "./intent"
import { view } from "./view"

import { ListSources, ListSinks, ListIntent, ItemSinks, Model } from './interfaces'

export default function <%= name %>({ DOM, HTTP }:ListSources):ListSinks {

  const removeProxy:Stream<{}> = Stream.create()

  const { actions, requests, add<%= itemNameU %>, <%= itemNameL %>RemoveSuccess }:ListIntent = intent({ DOM, HTTP }, removeProxy)
  const { states }:Model = model(actions)

  const list<%= itemNameU %>:ItemSinks = Collection(<%= itemNameL %>Item, { DOM }, add<%= itemNameU %>.map(<%= itemNameL %> => ({ <%= itemNameL %>: Stream.of(<%= itemNameL %>) })), item => item.remove)
  const list<%= itemNameU %>Vtrees:Stream<Array<VNode>> = Collection.pluck(list<%= itemNameU %>, item => item.DOM)
  const remove:Stream<Array<any>> = Collection.merge(list<%= itemNameU %>, item => item.remove<%= itemNameU %>)

  removeProxy.imitate(remove)

  return {
    DOM: Stream.combine(list<%= itemNameU %>Vtrees, states).map(view),
    HTTP: requests,
    history: Stream.empty(),
  }
}
