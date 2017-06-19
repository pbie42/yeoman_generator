import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { log, sample, assign, bind } from '../../utils'


export default function model(actions, submitter) {

  const updater = actions.map(action => bind(mergeState, action))
  const clearer = submitter.map(data => function clearReducer(prevState) {
    return { name: "", email: "", password: "",  }
  }).compose(delay(60))

  const reducer = xs.merge(updater, clearer)

  return { reducer }
}

export function mergeState(obj1, obj2) {
    const obj3 = {}
    for (let attrname in obj2) { obj3[attrname] = obj2[attrname] }
    for (let attrname in obj1) { obj3[attrname] = obj1[attrname] }
    return obj3
}
