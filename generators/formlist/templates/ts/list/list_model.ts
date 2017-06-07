import { Stream } from 'xstream'


export function model(actions):{ states:Stream<{}> } {
  const states:Stream<{}> = actions.fold((state, action) => action(state), { requests: {} })
  return { states }
}
