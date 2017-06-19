import xs from 'xstream'

import { sample } from "../utils"

import model from "./model"
import view from "./view"
import intent from "./intent"

import { editReducer } from './model.js'

export default function doperForm(sources, edits) {

  const state = sources.onion.state$

  const { actions, submitter, editor } = intent(sources)
  const { updater, reducer, edit } = model(actions, submitter, editor, edits)

  const new<%= itemNameU %> = sample(state, submitter)
  const edit<%= itemNameU %> = sample(state, editor)

  new<%= itemNameU %>.addListener({
    next: i => console.log(`new<%= itemNameU %>`, i)
  })

  return {
    DOM: xs.combine(state, edit).map(view),
    HTTP: xs.empty(),
    history: xs.empty(),
    onion: reducer,
    new<%= itemNameU %>,
    edit<%= itemNameU %>
  }

}
