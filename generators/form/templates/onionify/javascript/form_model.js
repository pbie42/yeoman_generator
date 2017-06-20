import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { log, sample, assign, bind, mergeStateLv1 } from '../../utils'


export default function model(actions, submitter) {

  const updater = actions.map(action => bind(mergeStateLv1, action))
  const clearer = submitter.map(data => function clearReducer(prevState) {
    return { <% inputs.forEach(i => { %><%= i %>: '', <% }) %> }
  }).compose(delay(60))

  const reducer = xs.merge(updater, clearer)

  return { reducer }
}
