import xs from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'
import delay from 'xstream/extra/delay'
import { div, p, button } from '@cycle/dom'
import { log } from '../../../utils'

export default function phonesItem({ DOM, phones, _idx}) {

  const removeEv = DOM.select('.remove').events('click')

  const remove = removeEv.compose(delay(50))

  const removePhones = xs.combine(phones, _idx, removeEv).map(function([ data, idx, _ ]) {
      return { brand: data.brand, model: data.model, year: data.year, id: idx }
  }).map(log)

  const items = xs.combine(phones, _idx)

  var sinks = {
    DOM: items.map(([{ brand, model, year,  }, _idx]) =>
      div({ attrs: { 'data-id': _idx } }, [
        p(`brand: ${brand}`),
        p(`model: ${model}`),
        p(`year: ${year}`),
        button('.remove', 'Remove')
      ])
    ),
    remove,
    removePhones
  }

  return sinks
}
