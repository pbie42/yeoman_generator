import { Stream } from 'xstream'

import model from "./model"
import view from "./view"
import intent from "./intent"

import { log } from "./utils"
import { FormSinks, State, FormStates, FormIntent, Sources } from '../interfaces'

export default function <%= formName %>({ DOM, HTTP }:Sources, edits:any):FormSinks {

  const resets: Stream<{}> = Stream.create()

  const { actions }:FormIntent = intent({ DOM, HTTP }, resets, edits)
  const { states, new<%= itemNameU %>, edit<%= itemNameU %> }:FormStates = model(actions)

  const newReset:Stream<State> = Stream.merge(new<%= itemNameU %>, edit<%= itemNameU %>)
  const edit:Stream<Boolean> = Stream.merge(Stream.empty().startWith(true),
                        edits.mapTo(false), edit<%= itemNameU %>.mapTo(true))

  resets.imitate(newReset)

  return {
    DOM: Stream.combine(states, edit).map(view),
    HTTP: Stream.empty(),
    history: Stream.empty(),
    new<%= itemNameU %>,
    edit<%= itemNameU %>
  }

}
