import xs from 'xstream'
import { <% inputs.forEach(i => { %><%= i %>Change, <% }) %>submitFn, clear } from './model'
import { Repo } from "./repo"
import { log, bind } from './utils'

export default function intent(sources, submits, reset) {

  const queries = Repo.setup(
    Repo.post("/submit", "submitForm").on(submits),
  )(sources.HTTP)

  const submitSuccess = queries.responses.submitForm
<% inputs.forEach(i => { %>
  const <%= i %> = sources.DOM.select('#<%= i %>').events('input')
                            .map(ev => ev.target.value)
                            .map(<%= i %> => bind(<%= i %>Change, <%= i %>))
<% }) %>
  const submit = sources.DOM.select('#submit').events('click')
                             .mapTo(submitFn)

  const actions = xs.merge( <% inputs.forEach(i => { %><%= i %>, <% }) %>submit, reset.mapTo(clear))

  return { actions, requests: queries.requests, submitSuccess }
}
