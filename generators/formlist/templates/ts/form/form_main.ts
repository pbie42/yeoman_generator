import { HTTPSource } from '@cycle/http';
import { Stream } from 'xstream'
import { DOMSource, VNode } from '@cycle/dom';

import { log } from "./utils"

import model from "./model"
import view from "./view"
import intent from "./intent"

import { Sources } from '../app'
import { State, States } from './model'

export interface formSinks {
  DOM:Stream<VNode>,
  HTTP:Stream<any>,
  history:Stream<any>,
  new<%= itemNameU %>:Stream<State>,
  edit<%= itemNameU %>:Stream<State>
}

export default function <%= formName %>({ DOM, HTTP }:Sources, edits:any):formSinks {

  const resets: Stream<{}> = Stream.create()

  const { actions } = intent({ DOM, HTTP }, resets, edits)
  const { states, new<%= itemNameU %>, edit<%= itemNameU %> }:States = model(actions)

  const newReset:Stream<State> = Stream.merge(new<%= itemNameU %>, edit<%= itemNameU %>)
  const edit:Stream<Boolean> = Stream.merge(Stream.empty().startWith(true),
                        edits.mapTo(false), edit<%= itemNameU %>.mapTo(true))

  resets.imitate(newReset)

  return {
    DOM: Stream.combine(states, edit).map(view),
    HTTP: Stream.empty(),
    history: Stream.empty(),
    new<%= itemNameU %>,
    edit<%= itemNameU %>
  }

}
