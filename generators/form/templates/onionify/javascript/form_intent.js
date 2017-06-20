import xs from 'xstream'
import { Repo } from "../repo"
import { log, bind } from '../../utils'

export default function intent(sources, submits) {

  const queries = Repo.setup(
    Repo.post("/submit", "submitForm").on(submits),
  )(sources.HTTP)

  const submitSuccess = queries.responses.submitForm

  <% inputs.forEach(i => { %>
  const <%= i %> = sources.DOM.select('#<%= i %>').events('input').map(ev => ({ <%= i %>: ev.target.value }))<% }) %>
  const submitter = sources.DOM.select('#submit').events('click').mapTo(null)

  const actions = xs.merge(<% inputs.forEach(i => { %><%= i %>, <% }) %>)

  return { actions, submitter, requests: queries.requests, submitSuccess }
}
