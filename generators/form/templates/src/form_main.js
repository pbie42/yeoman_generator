import xs from 'xstream'

import { log } from "../utils"

import model from "./model"
import view from "./view"
import intent from "./intent"

export default function <%= name %>(sources) {

  const resets = xs.create()
  const submits = xs.create()

  const { actions, requests, submitSuccess } = intent(sources, submits, resets)
  const { states, newSubmit } = model(actions)

  const newReset = xs.merge(newSubmit)

  submits.imitate(newSubmit)
  resets.imitate(newReset)

  return {
    DOM: states.map(view),
    HTTP: requests,
    history: xs.empty(),
    newSubmit,
  }
}
