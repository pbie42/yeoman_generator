import { Stream } from 'xstream'
import delay from 'xstream/extra/delay'

import { bind } from '../utils'
import { Reducer, State, FormModel, StatePiece } from '../interfaces'


export default function model(actions:Stream<StatePiece>, submitter:Stream<Reducer>, editor:Stream<Reducer>, edits:Stream<{}>):FormModel {

  const updater:Stream<Reducer> = actions.map(action => bind(mergeStateLv2, action))
  const editorReducer:Stream<Reducer> = edits.map(data => bind(editReducer, data))
  const clearerReducer:Stream<Reducer> = Stream.merge(submitter, editor).map(data => function clearReducer(prevState):State {
    return { <%= itemNameL %>: { <% inputs.forEach(i => { %><%= i %>: '', <% }) %> } }
  }).compose(delay(60))

  const edit:Stream<Boolean> = Stream.merge(Stream.empty().startWith(true), edits.mapTo(false), editor.mapTo(true))
  const reducer:Stream<Reducer> = Stream.merge(updater, clearerReducer)

  return { updater, reducer, edit }
}

export function editReducer(data:State, prevState:State):State { return data }

export function mergeStateLv2(obj1:Object, obj2:Object):Object {
    const obj3:Object = { <%= itemNameL %>: {} }
    for (let attrname in obj2) { obj3[attrname] = obj2[attrname] }
    for (let attrname in obj2.<%= itemNameL %>) { obj3.<%= itemNameL %>[attrname] = obj2.<%= itemNameL %>[attrname] }
    for (let attrname in obj1.<%= itemNameL %>) { obj3.<%= itemNameL %>[attrname] = obj1.<%= itemNameL %>[attrname] }
    return obj3
}