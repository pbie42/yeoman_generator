import xs from 'xstream'

import { log } from "../utils"

import model from "./model"
import view from "./view"
import intent from "./intent"

export default function <%= formName %>(sources, edits) {

  const resets = xs.create()

  const { actions } = intent(sources, resets, edits)
  const { states, new<%= itemNameU %>, edit<%= itemNameU %> } = model(actions)

  const newReset = xs.merge(new<%= itemNameU %>, edit<%= itemNameU %>)
  const edit = xs.merge(xs.empty().startWith(true),
                        edits.mapTo(false), edit<%= itemNameU %>.mapTo(true))

  resets.imitate(newReset)

  return {
    DOM: xs.combine(states, edit).map(view),
    HTTP: xs.empty(),
    history: xs.empty(),
    new<%= itemNameU %>,
    edit<%= itemNameU %>
  }

}
