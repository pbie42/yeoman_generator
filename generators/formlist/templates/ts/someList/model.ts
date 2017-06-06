import { log, sample, bind, assign } from '../../../utils'


export function model(actions) {
  const states = actions.fold((state, action) => action(state), { requests: {} }).map(log)
  return { states }
}
