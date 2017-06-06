import { Stream } from 'xstream'

import { nameChange, emailChange, locationChange, submitFn, clear, edit, editFn } from './model'

import { log, bind } from '../../../utils'

export default function intent({ DOM, HTTP }, reset, edits) {

  const nameEv:Stream<Event> = DOM.select('#name').events('input')
  const emailEv:Stream<Event> = DOM.select('#email').events('input')
  const locationEv:Stream<Event> = DOM.select('#location').events('input')
  const submitEv:Stream<Event> = DOM.select('#submit').events('click')
  const editEv:Stream<Event> = DOM.select('#editSubmit').events('click')

  const name:Stream<Function> = nameEv.map(ev => (ev.target as HTMLInputElement).value)
                                      .map(name => bind(nameChange, name))
  const email:Stream<Function> = emailEv.map(ev => (ev.target as HTMLInputElement).value)
                                        .map(email => bind(emailChange, email))
  const location:Stream<Function> = locationEv.map(ev => (ev.target as HTMLInputElement).value)
                                              .map(location => bind(locationChange, location))

  const submit:Stream<Function> = submitEv.mapTo(submitFn)

  const editSubmit = editEv.mapTo(editFn)

  const actions = Stream.merge(name, email, location, submit, reset.mapTo(clear), edits.map(data => bind(edit, data)), editSubmit)

  return { actions }
}
