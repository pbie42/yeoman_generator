import xs from 'xstream'
import { div, h1 } from '@cycle/dom'
import { assign } from './utils'

import <%= formName %> from './<%= formName %>/_<%= formName %>'
import <%= listName %> from './<%= listName %>/_<%= listName %>'

export default function app(sources) {

  const editsProxy = xs.create().startWith('')

  const form = <%= formName %>(sources, editsProxy)
  const list = <%= listName %>(assign(sources, { new<%= itemNameU %>: form.new<%= itemNameU %>,
                                             edit<%= itemNameU %>: form.edit<%= itemNameU %>}))

  editsProxy.imitate(list.edits)

  const view = ([form, list]) =>
    div([
      form,
      list
    ])


  return {
    DOM: xs.combine(form.DOM, list.DOM).map(view),
    HTTP: list.HTTP,
    history: xs.empty()
  }
}
