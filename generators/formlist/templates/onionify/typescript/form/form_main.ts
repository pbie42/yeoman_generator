import { Stream } from 'xstream'

import model from "./model"
import view from "./view"
import intent from "./intent"

import { sample } from "./utils"
import { FormSinks, FormIntent, FormModel, Sources, State } from '../interfaces'

export default function <%= formName %>({ DOM, HTTP, onion }:Sources, edits:Stream<{}>):FormSinks {

  const state:Stream<State> = onion.state$

  const { actions, submitter, editor }:FormIntent = intent({ DOM, HTTP, onion })
  const { updater, reducer, edit }:FormModel = model(actions, submitter, editor, edits)

  const new<%= itemNameU %>:Stream<State> = sample(state, submitter)
  const edit<%= itemNameU %>:Stream<State> = sample(state, editor)

  return {
    DOM: Stream.combine(state, edit).map(view),
    HTTP: Stream.empty(),
    history: Stream.empty(),
    onion: reducer,
    new<%= itemNameU %>,
    edit<%= itemNameU %>
  }

}
