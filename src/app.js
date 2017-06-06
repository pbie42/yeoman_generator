import xs from 'xstream'
import { div, h1 } from '@cycle/dom'
import { assign } from './utils'

import someForm from './someForm/_someForm'
import someList from './someList/_someList'

export default function app(sources) {

  const editsProxy = xs.create().startWith('')

  const form = someForm(sources, editsProxy)
  const list = someList(assign(sources, { newUsers: form.newUsers,
                                             editUsers: form.editUsers}))

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
