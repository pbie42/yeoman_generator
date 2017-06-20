import { Stream } from 'xstream'

import { log, sample } from "../../utils"
import { State, Reducer, Sources, Sinks, Intent } from './interfaces'

import model from "./model"
import view from "./view"
import intent from "./intent"

export default function <%= formName %>(sources:Sources):Sinks {

  const state = sources.onion.state$

  const initReducer:Stream<Reducer> = Stream.of(function initReducer(prevState) {
    return { <% inputs.forEach(i => { %><%= i %>: '', <% }) %> } // this is the initial state
  })

  const submits:Stream<{}> = Stream.create()

  const { actions, submitter, requests, submitSuccess }:Intent = intent(sources, submits)
  const { reducer }: { reducer: Stream<Reducer> } = model(actions, submitter)

  const newSubmit:Stream<State> = sample(state, submitter)
  const reducers:Stream<Reducer> = Stream.merge(initReducer, reducer)

  submits.imitate(newSubmit)

  return {
    DOM: state.map(view),
    HTTP: requests,
    onion: reducers,
    history: Stream.empty(),
    newSubmit,
  }
}
