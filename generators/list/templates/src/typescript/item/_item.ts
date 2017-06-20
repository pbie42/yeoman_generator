import { Stream } from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'
import delay from 'xstream/extra/delay'
import { li, p, button, VNode, DOMSource } from '@cycle/dom'
import { log } from '../../utils'

import { ItemSources, ItemSinks, Data } from '../interfaces'

export default function <%= itemNameL %>Item({ DOM, <%= itemNameL %>, _idx}:ItemSources):ItemSinks {

  const removeEv:Stream<Event> = DOM.select('.remove').events('click')

  const remove:Stream<Event> = removeEv.compose(delay(50))

  const remove<%= itemNameU %>:Stream<{ Data }> = Stream.combine(<%= itemNameL %>, _idx, removeEv).map(function([ data, idx, _ ]) {
      return { <% inputs.forEach(i => { %><%= i %>: data.<%= i %>, <% }) %>id: idx }
  }).map(log)

  const items:Stream<[ Data, Number ]> = Stream.combine(<%= itemNameL %>, _idx)

  var sinks:ItemSinks = {
    DOM: items.map(([{ <% inputs.forEach(i => { %><%= i %>, <% }) %> }, _idx]) =>
      li({ attrs: { 'data-id': _idx } }, [<% inputs.forEach(i => { %>
        p(`<%= i %>: ${<%= i %>}`),<% }) %>
        button('.remove', 'Remove')
      ])
    ),
    remove,
    remove<%= itemNameU %>
  }

  return sinks
}
