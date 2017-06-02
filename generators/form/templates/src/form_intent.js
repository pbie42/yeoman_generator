import xs from 'xstream'

import { {{#parts}}{{idName}}Change, {{/parts}}submitFn, clear } from './model'
import { Repo } from "../repo"
import { log, bind } from '../utils'

export default function intent(sources, submits, reset) {

  const queries = Repo.setup(
    Repo.post("/submit", "submitForm").on(submits),
  )(sources.HTTP)

  const submitSuccess = queries.responses.submitForm

  {{#parts}}
  const {{idName}} = sources.DOM.select('#{{idName}}').events('input')
                             .map(ev => ev.target.value)
                             .map({{idName}} => bind({{idName}}Change, {{idName}}))
  {{/parts}}

  const submit = sources.DOM.select('#submit').events('click')
                             .mapTo(submitFn)

  const actions = xs.merge({{#parts}}{{idName}}, {{/parts}}submit, reset.mapTo(clear))

  return { actions, requests: queries.requests, submitSuccess }
}
