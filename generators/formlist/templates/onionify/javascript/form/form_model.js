import xs from 'xstream'
import delay from 'xstream/extra/delay'

import { bind, mergeState } from '../utils'


export default function model(actions, submitter, editor, edits) {

  const updater = actions.map(action => bind(mergeState, action))
  const editorReducer = edits.map(data => bind(editReducer, data))
  const clearerReducer = xs.merge(submitter, editor).map(data => function clearReducer(prevState) {
    return { <%= itemNameL %>: { <% inputs.forEach(i => { %><%= i %>: "", <% }) %> } }
  }).compose(delay(60))

  const edit = xs.merge(xs.empty().startWith(true), edits.mapTo(false), editor.mapTo(true))
  const reducer = xs.merge(updater, clearerReducer)

  return { updater, reducer, edit }
}

export function editReducer(data, prevState) { return data }
