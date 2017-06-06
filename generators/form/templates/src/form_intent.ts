import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource } from '@cycle/dom';
import { <% inputs.forEach(i => { %><%= i %>Change, <% }) %>submitFn, clear } from './model'
import { Repo } from "../repo"
import { State } from './model'
import { log, bind } from '../../utils'

interface Sources {
  DOM:DOMSource,
  HTTP:HTTPSource
}

export default function intent({ DOM, HTTP }:Sources, submits:Stream<{}>, reset:Stream<{}>) {

  const queries = Repo.setup(
    Repo.post("/submit", "submitForm").on(submits),
  )(HTTP)

  const submitSuccess = queries.responses.submitForm

  const submitEv: Stream<Event> = DOM.select('#submit').events('click')
<% inputs.forEach(i => { %>
  const <%= i %>Ev: Stream<Event> = DOM.select('#<%= i %>').events('input')<% }) %>

<% inputs.forEach(i => { %>
  const <%= i %>: Stream<Function> = <%= i %>Ev.map(ev => (ev.target as HTMLInputElement).value)
                                       .map(<%= i %> => bind(<%= i %>Change, <%= i %>))
<% }) %>

  const submit: Stream<Function> = submitEv.mapTo(submitFn)

  const actions: Stream<Function> = Stream.merge( <% inputs.forEach(i => { %><%= i %>, <% }) %>submit, reset.mapTo(clear))

  return { actions, requests: queries.requests, submitSuccess }
}
