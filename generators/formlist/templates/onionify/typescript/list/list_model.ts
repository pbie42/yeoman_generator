import { Stream } from 'xstream'
import { ListState } from '../interfaces'

export function model(actions:Stream<Function>):{ states:Stream<ListState>} {
  const states:Stream<ListState> = actions.fold((state, action) => action(state), { requests: {} })
  return { states }
}
