import { Stream } from 'xstream'
import { log, sample, assign } from './utils'

import { State, FormStates, Data } from './interfaces'

export default function model(actions:Stream<Function | { name?:string }>):FormStates {
  const states:Stream<State> = actions.fold((state:State, action:Function):State => action(state), init())

  const submit:Stream<Function | {}> = actions.filter(action => action.name === 'submitFn')
  const new<%= itemNameU %>:Stream<State> = sample(states, submit)

  const editSubmit:Stream<Function | {}> = actions.filter(action => action.name === 'editFn')
  const edit<%= itemNameU %>:Stream<State> = sample(states, editSubmit)

  return { states, new<%= itemNameU %>, edit<%= itemNameU %> }
}

export const init = ():State => ({ <% inputs.forEach(i => { %><%= i %>: '', <% }) %> })

export const clear = ():State => init()

export const edit = (data:Data, state:State):State =>
      assign(state, { <% inputs.forEach(i => { %><%= i %>: data.<%= i %>, <% }) %>id: data.id })

export const submitFn = (state:State):State => state

export const editFn = (state:State):State => state
<% inputs.forEach(i => { %>
export const <%= i %>Change = (<%= i %>:string, state:State):State => assign(state, { <%= i %> })
<% }) %>
