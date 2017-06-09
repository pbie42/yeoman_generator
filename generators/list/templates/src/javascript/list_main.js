import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import Collection from "../collections"

import { log, sample, bind } from '../../utils'
import phonesItem from './item/_item'

import { model, Status } from "./model"
import { intent } from "./intent"
import { view } from "./view"

export default function List({ DOM, HTTP }) {

  const removeProxy = xs.create()

  const { actions, requests, addPhones, phonesRemoveSuccess } = intent({ DOM, HTTP }, removeProxy)
  const { states } = model(actions)

  const listPhones = Collection(phonesItem, { DOM }, addPhones.map(phones => ({ phones: xs.of(phones) })), item => item.remove)
  const listPhonesVtrees = Collection.pluck(listPhones, item => item.DOM)
  const remove = Collection.merge(listPhones, item => item.removePhones).map(log)

  removeProxy.imitate(remove)

  return {
    DOM: xs.combine(listPhonesVtrees, states).map(view),
    HTTP: requests,
    history: xs.empty(),
  }
}
