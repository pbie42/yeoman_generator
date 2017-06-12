import { Stream } from 'xstream'
import { div, VNode } from '@cycle/dom'
import { assign } from '../../utils'

import <%= formName %> from './<%= formName %>/_<%= formName %>'
import <%= listName %> from './<%= listName %>/_<%= listName %>'

import { Sources, Sinks, FormSinks, ListSinks } from './interfaces'

export default function app({DOM, HTTP}:Sources):Sinks {

  const editsProxy:Stream<{}> = Stream.create().startWith('')

  const form:FormSinks = <%= formName %>({ DOM, HTTP }, editsProxy)
  const list:ListSinks = <%= listName %>(assign({ DOM, HTTP }, { new<%= itemNameU %>: form.new<%= itemNameU %>,
                                             edit<%= itemNameU %>: form.edit<%= itemNameU %>}))

  editsProxy.imitate(list.edits)

  const view = ([form, list]:Array<VNode>):VNode =>
    div([
      form,
      list
    ])


  return {
    DOM: Stream.combine(form.DOM, list.DOM).map(view),
    HTTP: list.HTTP,
    history: Stream.empty()
  }
}
