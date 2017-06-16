import { Stream } from 'xstream'
import delay from 'xstream/extra/delay'

import { bind, mergeState } from '../../../utils'
import { Reducer, State, FormModel, StatePiece } from '../interfaces'


export default function model(actions:Stream<StatePiece>, submitter:Stream<Reducer>, editor:Stream<Reducer>, edits:Stream<{}>):FormModel {

  const updater:Stream<Reducer> = actions.map(action => bind(mergeState, action))
  const editorReducer:Stream<Reducer> = edits.map(data => bind(editReducer, data))
  const clearerReducer:Stream<Reducer> = Stream.merge(submitter, editor).map(data => function clearReducer(prevState):State {
    return { pets: { name: '', type: '', color: '' }}
  }).compose(delay(60))

  const edit:Stream<Boolean> = Stream.merge(Stream.empty().startWith(true), edits.mapTo(false), editor.mapTo(true))
  const reducer:Stream<Reducer> = Stream.merge(updater, clearerReducer)

  return { updater, reducer, edit }
}

export function editReducer(data:State, prevState:State):State { return data }
