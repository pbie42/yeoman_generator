import { Stream } from 'xstream'
import isolate from '@cycle/isolate'
import { div, VNode } from '@cycle/dom'
import { assign } from '../../utils'


import betterForm from './betterForm/_betterForm'
import betterList from './betterList/_betterList'

import { Sources, Sinks, FormSinks, ListSinks, Reducer, State } from './interfaces'

export default function app({DOM, HTTP, onion }:Sources):Sinks {

  const editsProxy:Stream<{}> = Stream.create().startWith('')

  const initReducer:Stream<Reducer> = Stream.of(function initReducer(prevState):State {
    return { pets: { name: '', type: '', color: '' } } // this is the initial state
  })

  const formListLens:{ get: Function, set: Function} = {
    get: state => ({ pets: state.pets }),
    set: (state, childState) => (assign({}, state, { pets: childState.pets }))
  }

  const form:FormSinks = isolate(betterForm, { onion: formListLens })({ DOM, HTTP, onion }, editsProxy)
  const list = isolate(betterList, { onion: formListLens })({ DOM, HTTP, onion }, form.newPets, form.editPets)

  const reducer = Stream.merge(initReducer, form.onion, list.onion)
  const view = ([form, list]:Array<{}>):VNode => div([ form, list ])

  editsProxy.imitate(list.edits)

  return {
    DOM: Stream.combine(form.DOM, list.DOM).map(view),
    HTTP: list.HTTP,
    history: Stream.empty(),
    onion: reducer
  }
}
