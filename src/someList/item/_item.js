import xs from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'
import { div, p, button } from '@cycle/dom'

export default function peopleItem({ DOM, people, _idx}) {

  const remove = DOM.select('.remove').events('click').mapTo(null)
  const edit = DOM.select('.edit').events('click')

  const edits = xs.combine(people, _idx, edit).map(function([ data, idx, _ ]) {
      return { name: data.name, email: data.email, location: data.location, id: idx }
    })

  const item = xs.combine(people, _idx)

  var sinks = {
    DOM: item.map(([{ name, email, location,  }, _idx]) =>
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
