import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { div, h1, DOMSource, VNode } from '@cycle/dom'
import { assign } from '../../utils'

import someForm from './someForm/_someForm'
import someList from './someList/_someList'

import { formSinks } from './someForm/_someForm'

export interface Sources {
  DOM:DOMSource,
  HTTP:HTTPSource
}

interface Sinks {
  DOM: Stream<VNode>,
  HTTP: Stream<any>,
  history: Stream<any>,
}

export default function app({DOM, HTTP}:Sources):Sinks {

  const editsProxy:Stream<{}> = Stream.create().startWith('')

  const form:formSinks = someForm({ DOM, HTTP }, editsProxy)
  const list = someList(assign({ DOM, HTTP }, { newPeople: form.newPeople,
                                             editPeople: form.editPeople}))

  editsProxy.imitate(list.edits)

  const view = ([form, list]) =>
    div([
      form,
      list
    ])


  return {
    DOM: Stream.combine(form.DOM, list.DOM).map(view),
    HTTP: list.HTTP,
    history: Stream.empty()
  }
}
