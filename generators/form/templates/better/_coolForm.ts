import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource, VNode } from '@cycle/dom';

import model from "./model"
import view from "./view"
import intent from "./intent"

import { Sources, FormSinks, Intent, Model, State } from './interfaces'

export default function someForm({DOM, HTTP}: Sources): FormSinks {

  const resets: Stream<{}> = Stream.create()
  const submits: Stream<{}> = Stream.create()

  const { actions, requests, submitSuccess }:Intent = intent({ DOM, HTTP }, submits, resets)
  const { states, newSubmit }:Model = model(actions)

  const newReset:Stream<State> = Stream.merge(newSubmit)

  submits.imitate(newSubmit)
  resets.imitate(newReset)

  return {
    DOM: states.map(view),
    HTTP: requests,
    history: Stream.empty(),
    newSubmit,
  }
}
