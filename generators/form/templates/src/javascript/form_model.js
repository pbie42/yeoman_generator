import { log, sample, assign } from '../utils'


export default function model(actions, queries) {
  const states = actions.fold((state, action) => action(state), init())

  const submit = actions.filter(action => action.name === 'submitFn')
  const newSubmit = sample(states, submit)

  return { states, newSubmit }
}

export const init = () => ({ <% inputs.forEach(i => { %><%= i %>: '', <% }) %> })

export const clear = () => init()

export const submitFn = (state) => state
<% inputs.forEach(i => { %>
export const <%= i %>Change = (<%= i %>, state) => assign(state, { <%= i %> })
<% }) %>