import { Stream } from 'xstream'
import { log, sample, assign } from '../utils'

import { State, Model } from './interfaces'

export default function model(actions: Stream<Function>):Model {

  const states:Stream<State> = actions.fold((state:State, action:Function):State => action(state), init())

  const submit:Stream<Function> = actions.filter(action => action.name === 'submitFn')
  const newSubmit:Stream<State | Object> = sample(states, submit)

  return { states, newSubmit }
}


export const init = ():State => ({ <% inputs.forEach(i => { %><%= i %>: '', <% }) %> })

export const clear = ():State => init()

export const submitFn = (state:State):State => state
<% inputs.forEach(i => { %>
export const <%= i %>Change = (<%= i %>:string, state:State):State => assign(state, { <%= i %> })
<% }) %>