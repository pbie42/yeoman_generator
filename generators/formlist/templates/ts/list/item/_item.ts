import { Stream } from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'
import { div, p, button, DOMSource } from '@cycle/dom'

import { State } from '../../someForm/model'

interface ItemSources {
  DOM:DOMSource,
  people: Stream<State>,
  _idx:Stream<number>
}

export default function peopleItem({ DOM, people, _idx}:ItemSources ) {

  const removeEv:Stream<Event> = DOM.select('.remove').events('click')
  const remove = removeEv.mapTo(null)
  const edit = DOM.select('.edit').events('click')

  const edits = Stream.combine(people, _idx, edit).map(function([ data, idx, _ ]) {
      return { name: data.name, email: data.email, location: data.location, id: idx }
    })

  const items = Stream.combine(people, _idx)

  var sinks = {
    DOM: items.map(([{ name, email, location,  }, _idx]) =>
      div({ attrs: { 'data-id': _idx } }, [
        
        p(name),
        
        p(email),
        
        p(location),
        
        button('.edit', 'Edit'),
        button('.remove', 'Remove')
      ])
    ),
    remove,
    edits
  }

  return sinks
}
