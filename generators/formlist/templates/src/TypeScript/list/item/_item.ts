import { Stream } from "xstream"
import { li, p, button } from '@cycle/dom'

import { State, ItemSources, ItemSinks, Data } from '../../interfaces'

export default function <%= itemNameL %>Item({ DOM, <%= itemNameL %>, _idx}:ItemSources ):ItemSinks {

  const removeEv:Stream<Event> = DOM.select('.remove').events('click')
  const editEv:Stream<Event> = DOM.select('.edit').events('click')

  const remove:Stream<null> = removeEv.mapTo(null)
  const edits:Stream<Data> = Stream.combine(<%= itemNameL %>, _idx, editEv).map(function([ data, idx, _ ]) {
      return { <% inputs.forEach(i => { %><%= i %>: data.<%= i %>, <% }) %>id: idx }
    })

  const itemState:Stream<[State, Number]> = Stream.combine(<%= itemNameL %>, _idx)

  return {
    DOM: itemState.map(([{ <% inputs.forEach(i => { %><%= i %>, <% }) %> }, _idx]) =>
      li({ attrs: { 'data-id': _idx } }, [<% inputs.forEach(i => { %>
        p(`<%= i %>: ${<%= i %>}`),<% }) %>
        button('.edit', 'Edit'),
        button('.remove', 'Remove')
      ])
    ),
    remove,
    edits
  }
}
