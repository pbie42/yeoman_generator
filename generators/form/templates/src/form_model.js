import { log, sample, assign } from '../utils'


export default function model(actions, queries) {
  const states = actions.fold((state, action) => action(state), init())

  const submit = actions.filter(action => action.name === 'submitFn')
  const newSubmit = sample(states, submit)

  return { states, newSubmit }
}

<% inputs.forEach(function(opt) { %> 
						<%- JSON.stringify(opt) %>, <% }); %>

export const init = () => ({ {{#parts}}{{idName}}: '', {{/parts}} })

export const clear = () => init()

export const submitFn = (state) => state

{{#parts}}
export const {{idName}}Change = ({{idName}}, state) => assign(state, { {{idName}} })
{{/parts}}
