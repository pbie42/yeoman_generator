import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource, VNode } from '@cycle/dom';
import sampleCombine from 'xstream/extra/sampleCombine'
import Collection from "../../collections"

import { log, sample, bind } from '../../../utils'
import peopleItem from './item/_item'

import { model } from "./model"
import { intent } from "./intent"
import { view } from "./view"

import { State } from '../someForm/model'

export interface ListSources {
  DOM:DOMSource,
  HTTP:HTTPSource,
  newPeople:Stream<State>,
  editPeople:Stream<State>
}

interface ListSinks {
  DOM: Stream<VNode>,
  HTTP: Stream<any>,
  history:Stream<any>,
  edits:Stream<any>
}

export default function List({ DOM, HTTP, newPeople, editPeople }:ListSources):ListSinks {

  const { actions, requests, addPeople, peopleEditSuccess } = intent({ DOM, HTTP, newPeople, editPeople })
  const { states } = model(actions)

  const listPeople = Collection(peopleItem, { DOM }, addPeople.map(people => ({ people: Stream.of(people) })), item => item.remove)
  const listPeopleVtrees:Stream<Array<VNode>> = Collection.pluck(listPeople, item => item.DOM)
  const edits:Stream<Array<State>> = Collection.merge(listPeople, item => item.edits)

  const edit = peopleEditSuccess.compose(sampleCombine(editPeople)).map(([_, edit]) => edit)

  return {
    DOM: Stream.combine(listPeopleVtrees, states, edit.startWith('')).map(view),
    HTTP: requests,
    history: Stream.empty(),
    edits
  }
}
