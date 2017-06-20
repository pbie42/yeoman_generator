import xs from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'
import delay from 'xstream/extra/delay'
import { div, p, button } from '@cycle/dom'
import { log } from '../../utils'

export default function <%= itemNameL %>Item({ DOM, <%= itemNameL %>, _idx}) {

  const removeEv = DOM.select('.remove').events('click')

  const remove = removeEv.compose(delay(50))

  const remove<%= itemNameU %> = xs.combine(<%= itemNameL %>, _idx, removeEv).map(function([ data, idx, _ ]) {
      return { <% inputs.forEach(i => { %><%= i %>: data.<%= i %>, <% }) %>id: idx }
  }).map(log)

  const items = xs.combine(<%= itemNameL %>, _idx)

  var sinks = {
    DOM: items.map(([{ <% inputs.forEach(i => { %><%= i %>, <% }) %> }, _idx]) =>
      div({ attrs: { 'data-id': _idx } }, [<% inputs.forEach(i => { %>
        p(`<%= i %>: ${<%= i %>}`),<% }) %>
        button('.remove', 'Remove')
      ])
    ),
    remove,
    remove<%= itemNameU %>
  }

  return sinks
}
