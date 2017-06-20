import { log, sample, assign } from '../utils'


export default function model(actions) {
  const states = actions.fold((state, action) => action(state), init())

  const submit = actions.filter(action => action.name === 'submitFn')
  const new<%= itemNameU %> = sample(states, submit)

  const editSubmit = actions.filter(action => action.name === 'editFn')
  const edit<%= itemNameU %> = sample(states, editSubmit)

  return { states, new<%= itemNameU %>, edit<%= itemNameU %> }
}

export const init = () => ({ <% inputs.forEach(i => { %><%= i %>: '', <% }) %> })

export const clear = () => init()

export const edit = (data, compState) =>
      assign(state, { <% inputs.forEach(i => { %><%= i %>: data.<%= i %>, <% }) %>id: data.id })

export const submitFn = (compState) => compState

export const editFn = (compState) => compState
<% inputs.forEach(i => { %>
export const <%= i %>Change = (<%= i %>, compState) => assign(compState, { <%= i %> })
<% }) %>
