import { Stream } from "xstream"
import { div, p, button } from '@cycle/dom'

import { StatePeel, ItemSources, ItemSinks, Data } from '../../interfaces'

export default function petsItem({ DOM, pets, _idx}:ItemSources ):ItemSinks {

  const removeEv:Stream<Event> = DOM.select('.remove').events('click')
  const editEv:Stream<Event> = DOM.select('.edit').events('click')

  const remove:Stream<null> = removeEv.mapTo(null)
  const edits:Stream<Data> = Stream.combine(pets, _idx, editEv).map(function([ data, idx, _ ]) {
      return { name: data.name, type: data.type, color: data.color, id: idx }
    })

  const itemState:Stream<[StatePeel, Number]> = Stream.combine(pets, _idx)

  return {
    DOM: itemState.map(([{ name, type, color,  }, _idx]) =>
      div({ attrs: { 'data-id': _idx } }, [
        p(`name: ${name}`),
        p(`type: ${type}`),
        p(`color: ${color}`),
        button('.edit', 'Edit'),
        button('.remove', 'Remove')
      ])
    ),
    remove,
    edits
  }
}
