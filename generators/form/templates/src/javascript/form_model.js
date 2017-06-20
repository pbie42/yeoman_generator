import { log, sample, assign } from './utils'


export default function model(actions) {
  const states = actions.fold((state, action) => action(state), init())

  const submit = actions.filter(action => action.name === 'submitFn')
  const newSubmit = sample(states, submit)

  return { states, newSubmit }
}

export const init = () => ({ <% inputs.forEach(i => { %><%= i %>: '', <% }) %> })

export const clear = () => init()

export const submitFn = (compState) => compState
<% inputs.forEach(i => { %>
export const <%= i %>Change = (<%= i %>, compState) => assign(compState, { <%= i %> })
<% }) %>