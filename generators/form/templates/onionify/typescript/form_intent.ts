import { Stream } from 'xstream'
import { Repo } from "../repo"
import { log, bind } from '../../utils'

import { StatePiece, State, Queries, Intent, Sources } from './interfaces'

export default function intent(sources:Sources, submits:Stream<{}>):Intent {

  const queries:Queries = Repo.setup(
    Repo.post("/submit", "submitForm").on(submits),
  )(sources.HTTP)

  const submitSuccess: Stream<State[]> = queries.responses.submitForm

  <% inputs.forEach(i => { %>
  const <%= i %>Ev:Stream<Event> = DOM.select('#<%= i %>').events('input')<% }) %>
  const submitterEv:Stream<Event> = sources.DOM.select('#submit').events('click')

  <% inputs.forEach(i => { %>
  const <%= i %>:Stream<StatePiece> = <%= i %>Ev.map(ev => ({ <%= i %>: (ev.target as HTMLInputElement).value }))<% }) %>
  const submitter:Stream<null> = submitterEv.mapTo(null)

  const actions:Stream<StatePiece> = Stream.merge(name, email, password, )

  return { actions, submitter, requests: queries.requests, submitSuccess }
}
