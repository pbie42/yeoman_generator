import xs from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'
import { div, p, button } from '@cycle/dom'

export default function <%= itemNameL %>Item({ DOM, <%= itemNameL %>, _idx}) {

  const remove = DOM.select('.remove').events('click').mapTo(null)
  const edit = DOM.select('.edit').events('click')

  const edits = xs.combine(<%= itemNameL %>, _idx, edit).map(function([ data, idx, _ ]) {
      return { <% inputs.forEach(i => { %><%= i %>: data.<%= i %>, <% }) %>id: idx }
    })

  const items = xs.combine(<%= itemNameL %>, _idx)

  var sinks = {
    DOM: items.map(([{ <% inputs.forEach(i => { %><%= i %>, <% }) %> }, _idx]) =>
      div({ attrs: { 'data-id': _idx } }, [
        <% inputs.forEach(i => { %>
        p(<%= i %>),
        <% }) %>
        button('.edit', 'Edit'),
        button('.remove', 'Remove')
      ])
    ),
    remove,
    edits
  }

  return sinks
}
