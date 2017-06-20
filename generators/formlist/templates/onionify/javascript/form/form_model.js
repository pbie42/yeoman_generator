import xs from 'xstream'
import delay from 'xstream/extra/delay'

import { bind } from '../utils'


export default function model(actions, submitter, editor, edits) {

  const updater = actions.map(action => bind(mergeStateLv2, action))
  const editorReducer = edits.map(data => bind(editReducer, data))
  const clearerReducer = xs.merge(submitter, editor).map(data => function clearReducer(prevState) {
    return { <%= itemNameL %>: { <% inputs.forEach(i => { %><%= i %>: "", <% }) %> } }
  }).compose(delay(60))

  const edit = xs.merge(xs.empty().startWith(true), edits.mapTo(false), editor.mapTo(true))
  const reducer = xs.merge(updater, clearerReducer)

  return { updater, reducer, edit }
}

export function editReducer(data, prevState) { return data }

export function mergeStateLv2(obj1, obj2) {
    const obj3 = { <%= itemNameL %>: {} }
    for (let attrname in obj2) { obj3[attrname] = obj2[attrname] }
    for (let attrname in obj2.<%= itemNameL %>) { obj3.<%= itemNameL %>[attrname] = obj2.<%= itemNameL %>[attrname] }
    for (let attrname in obj1.<%= itemNameL %>) { obj3.<%= itemNameL %>[attrname] = obj1.<%= itemNameL %>[attrname] }
    return obj3
}