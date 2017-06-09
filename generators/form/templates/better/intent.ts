import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource } from '@cycle/dom';

import { nameChange, emailChange, passwordChange, submitFn, clear } from './model'
import { Repo } from "../repo"
import { log, bind } from '../../utils'

import { Sources, Intent, Queries } from './interfaces'

export default function intent({ DOM, HTTP }:Sources, submits:Stream<{}>, reset:Stream<{}>):Intent {

  const queries:Queries = Repo.setup(
    Repo.post("/submit", "submitForm").on(submits),
  )(HTTP)

  const submitSuccess:Stream<{}> = queries.responses.submitForm

  const submitEv: Stream<Event> = DOM.select('#submit').events('click')

  const nameEv: Stream<Event> = DOM.select('#name').events('input')
  const emailEv: Stream<Event> = DOM.select('#email').events('input')
  const passwordEv: Stream<Event> = DOM.select('#password').events('input')


  const name: Stream<Function> = nameEv.map(ev => (ev.target as HTMLInputElement).value)
                                       .map(name => bind(nameChange, name))

  const email: Stream<Function> = emailEv.map(ev => (ev.target as HTMLInputElement).value)
                                       .map(email => bind(emailChange, email))

  const password: Stream<Function> = passwordEv.map(ev => (ev.target as HTMLInputElement).value)
                                       .map(password => bind(passwordChange, password))

  const submit: Stream<Function> = submitEv.mapTo(submitFn)

  const actions: Stream<Function> = Stream.merge( name, email, password, submit, reset.mapTo(clear))

  return { actions, requests: queries.requests, submitSuccess }
}
