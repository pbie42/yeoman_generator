import xs from 'xstream'
import { Repo } from "../repo"
import { log, bind } from '../../utils'

export default function intent(sources, submits) {

  const queries = Repo.setup(
    Repo.post("/submit", "submitForm").on(submits),
  )(sources.HTTP)

  const submitSuccess = queries.responses.submitForm

  const name = sources.DOM.select('#name').events('input').map(ev => ({ name: ev.target.value}))
  const email = sources.DOM.select('#email').events('input').map(ev => ({ email: ev.target.value}))
  const password = sources.DOM.select('#password').events('input').map(ev => ({ password: ev.target.value }))
  const submitter = sources.DOM.select('#submit').events('click').mapTo(null)

  const actions = xs.merge(name, email, password)

  return { actions, submitter, requests: queries.requests, submitSuccess }
}
