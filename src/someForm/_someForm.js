import xs from 'xstream'

import { log } from "../utils"

import model from "./model"
import view from "./view"
import intent from "./intent"

export default function someForm(sources, edits) {

  const resets = xs.create()

  const { actions } = intent(sources, resets, edits)
  const { states, newUsers, editUsers } = model(actions)

  const newReset = xs.merge(newUsers, editUsers)
  const edit = xs.merge(xs.empty().startWith(true),
                        edits.mapTo(false), editUsers.mapTo(true))

  resets.imitate(newReset)

  return {
    DOM: xs.combine(states, edit).map(view),
    HTTP: xs.empty(),
    history: xs.empty(),
    newUsers,
    editUsers
  }

}
