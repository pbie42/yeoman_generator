import { Stream } from 'xstream'

import { log, bind } from '../../../utils'
import { FormIntent, Sources, StatePiece } from '../interfaces';

export default function intent({ DOM, HTTP }:Sources):FormIntent {

  <% inputs.forEach(i => { %>
  const <%= i %>Ev:Stream<Event> = DOM.select('#<%= i %>').events('input')<% }) %>
  const submitEv:Stream<Event> = DOM.select('#submit').events('click')
  const editEv:Stream<Event> = DOM.select('#editSubmit').events('click')

  <% inputs.forEach(i => { %>
  const <%= i %>:Stream<StatePiece> = <%= i %>Ev.map(ev => ({ <%= itemNameL %>: { <%= i %>: (ev.target as HTMLInputElement).value } }))<% }) %>
  const submitter:Stream<null> = submitEv.mapTo(null)
  const editor:Stream<null> = editEv.mapTo(null)

  const actions:Stream<StatePiece> = Stream.merge(<% inputs.forEach(i => { %><%= i %>, <% }) %>)

  return { actions, submitter, editor }
}
