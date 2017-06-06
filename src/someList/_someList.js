import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import Collection from "../collections"

import { log, sample, bind } from '../utils'
import peopleItem from './item/_item'

import { model, Status } from "./model"
import { intent } from "./intent"
import { view } from "./view"

export default function List({ DOM, HTTP, newPeople, editPeople }) {

  const { actions, requests, addPeople, peopleEditSuccess } = intent({ DOM, HTTP, newPeople, editPeople })
  const { states } = model(actions)

  const listPeople = Collection(peopleItem, { DOM }, addPeople.map(people => ({ people: xs.of(people) })), item => item.remove)
  const listPeopleVtrees = Collection.pluck(listPeople, item => item.DOM)
  const edits = Collection.merge(listPeople, item => item.edits)

  const edit = peopleEditSuccess.compose(sampleCombine(editPeople)).map(([_, edit]) => edit)

  return {
    DOM: xs.combine(listPeopleVtrees, states, edit.startWith('')).map(view),
    HTTP: requests,
    history: xs.empty(),
    edits
  }
}
