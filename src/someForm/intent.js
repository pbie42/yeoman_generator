import xs from 'xstream'

import { {{#parts}}{{idName}}Change, {{/parts}}submitFn, clear, edit, editFn } from './model'

import { log, bind } from '../utils'

export default function intent(sources, reset, edits) {

  {{#parts}}
  const {{idName}} = sources.DOM.select('#{{idName}}').events('input')
                             .map(ev => ev.target.value)
                             .map({{idName}} => bind({{idName}}Change, {{idName}}))
  {{/parts}}

  const submit = sources.DOM.select('#submit').events('click')
                             .mapTo(submitFn)

  const editSubmit = sources.DOM.select('#editSubmit').events('click')
                             .mapTo(editFn)

  const actions = xs.merge({{#parts}}{{idName}}, {{/parts}}submit, reset.mapTo(clear), edits.map(data => bind(edit, data)), editSubmit)

  return { actions }
}
