import xs from 'xstream'

import { log, sample } from "../../utils"

import model from "./model"
import view from "./view"
import intent from "./intent"

export default function <%= fromName %>(sources) {

  const state = sources.onion.state$

  const initReducer = xs.of(function initReducer(prevState) {
    return { <% inputs.forEach(i => { %><%= i %>: '', <% }) %> } // this is the initial state
  })

  const submits = xs.create()

  const { actions, submitter, requests, submitSuccess } = intent(sources, submits)
  const { reducer } = model(actions, submitter)

  const newSubmit = sample(state, submitter)
  const reducers = xs.merge(initReducer, reducer)

  submits.imitate(newSubmit)

  return {
    DOM: state.map(view),
    HTTP: requests,
    onion: reducers,
    history: xs.empty(),
    newSubmit,
  }
}
