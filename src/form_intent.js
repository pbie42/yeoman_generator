import xs from 'xstream'
import { nameChange, emailChange, passwordChange, submitFn, clear } from './model'
import { Repo } from "../repo"
import { log, bind } from '../utils'

export default function intent(sources, submits, reset) {

  const queries = Repo.setup(
    Repo.post("/submit", "submitForm").on(submits),
  )(sources.HTTP)

  const submitSuccess = queries.responses.submitForm

  const name = sources.DOM.select('#name').events('input')
                            .map(ev => ev.target.value)
                            .map(name => bind(nameChange, name))

  const email = sources.DOM.select('#email').events('input')
                            .map(ev => ev.target.value)
                            .map(email => bind(emailChange, email))

  const password = sources.DOM.select('#password').events('input')
                            .map(ev => ev.target.value)
                            .map(password => bind(passwordChange, password))

  const submit = sources.DOM.select('#submit').events('click')
                             .mapTo(submitFn)

  const actions = xs.merge( name, email, password, submit, reset.mapTo(clear))

  return { actions, requests: queries.requests, submitSuccess }
}
