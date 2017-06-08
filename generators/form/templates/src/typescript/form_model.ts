import { Stream } from 'xstream'
import { log, sample, assign } from './utils'

export interface State {
  name: string,
  email: string,
  password: string
}

export default function model(actions: Stream<Function>) {

  const states:Stream<State> = actions.fold((state, action) => action(state), init())

  const submit:Stream<Function> = actions.filter(action => action.name === 'submitFn')
  const newSubmit:Stream<State> = sample(states, submit)

  return { states, newSubmit }
}


export const init = () => ({ <% inputs.forEach(i => { %><%= i %>: '', <% }) %> })

export const clear = () => init()

export const submitFn = (state) => state
<% inputs.forEach(i => { %>
export const <%= i %>Change = (<%= i %>, state) => assign(state, { <%= i %> })
<% }) %>


