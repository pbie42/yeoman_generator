import { Stream } from 'xstream'
import { log, sample, assign } from './utils'

export interface State {<% inputs.forEach(i => { %>
  <%= i %>: string, <% }) %>
}

export interface States {
  states:Stream<State>,
  new<%= itemNameU %>:Stream<State>,
  edit<%= itemNameU %>:Stream<State>
}

export default function model(actions):States {
  const states:Stream<State> = actions.fold((state, action) => action(state), init())

  const submit:Stream<Function> = actions.filter(action => action.name === 'submitFn')
  const new<%= itemNameU %>:Stream<State> = sample(states, submit)

  const editSubmit:Stream<Function> = actions.filter(action => action.name === 'editFn')
  const edit<%= itemNameU %>:Stream<State> = sample(states, editSubmit)

  return { states, new<%= itemNameU %>, edit<%= itemNameU %> }
}

export const init = () => ({ <% inputs.forEach(i => { %><%= i %>: '', <% }) %> })

export const clear = () => init()

export const edit = (data, state) =>
      assign(state, { <% inputs.forEach(i => { %><%= i %>: data.<%= i %>, <% }) %>id: data.id })

export const submitFn = (state) => state

export const editFn = (state) => state
<% inputs.forEach(i => { %>
export const <%= i %>Change = (<%= i %>, state) => assign(state, { <%= i %> })
<% }) %>

