import { Stream } from 'xstream'
import delay from 'xstream/extra/delay'

import { log, sample, assign, bind, mergeStateLv1 } from '../../utils'
import { Reducer } from './interfaces'


export default function model(actions, submitter):{ reducer: Stream<Reducer> } {

  const updater:Stream<Reducer> = actions.map(action => bind(mergeStateLv1, action))
  const clearer:Stream<Reducer> = submitter.map(data => function clearReducer(prevState) {
    return { <% inputs.forEach(i => { %><%= i %>: '', <% }) %> }
  }).compose(delay(60))

  const reducer:Stream<Reducer> = Stream.merge(updater, clearer)

  return { reducer }
}
