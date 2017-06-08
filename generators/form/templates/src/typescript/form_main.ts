import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource, VNode } from '@cycle/dom';

import model from "./model"
import view from "./view"
import intent from "./intent"

interface Sources {
  DOM:DOMSource,
  HTTP:HTTPSource
}

interface FormSinks {
  DOM: Stream<VNode>,
  HTTP: Stream<any>,
  history: Stream<any>,
  newSubmit: Stream<any>
}

export default function someForm({DOM, HTTP}: Sources): FormSinks {

  const resets: Stream<{}> = Stream.create()
  const submits: Stream<{}> = Stream.create()

  const { actions, requests, submitSuccess } = intent({ DOM, HTTP }, submits, resets)
  const { states, newSubmit } = model(actions)

  const newReset = Stream.merge(newSubmit)

  submits.imitate(newSubmit)
  resets.imitate(newReset)

  return {
    DOM: states.map(view),
    HTTP: requests,
    history: Stream.empty(),
    newSubmit,
  }
}
