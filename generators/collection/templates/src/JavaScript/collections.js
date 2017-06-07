import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'

import { log } from './utils'

const assign = Object.assign
const bind = (fn, ...args) => fn.bind(this, ...args)
const noop = Function.prototype()

const isVtree = (x) =>
  x && typeof x.sel === 'string'

function makeIdGen() {
  let ids = 0
  return () => ids++
}

function makeItem(component, sources, idGen) {
  const newId = idGen()
  const newItem = isolate(component, newId.toString())(sources)
  newItem._id = newId
  newItem._name = component.name
  return newItem
}

function collection(config, items = []) {
  const { component, sources, idGen, removeSelector } = config
  return {
    add(extraSources = {}) {
      const newItem = makeItem(component, assign({}, sources, extraSources, { _idx: xs.of(items.length) }), idGen)
      newItem._remove = removeSelector(newItem).take(1).mapTo(newItem) || xs.empty()
      return collection(config, items.concat(newItem))
    },
    remove(item) {
      return collection(config, items.filter(x => x !== item))
    },
    asArray() { return items.slice() },
    clear() {
      return collection(config)
    }
  }
}

function Collection(component, sources = {}, adds = xs.empty(), removeSelector = noop, clears = xs.empty()) {

  const addActions = adds.map(extraSources => bind(addToCollection, extraSources))

  const removeProxy = xs.create()
  const removeActions = removeProxy.map(item => bind(removeFromCollection, item))
  const clearActions = clears.mapTo(clearCollection)

  const actions = xs.merge(addActions, removeActions, clearActions)
  const emptyCol = collection({ component, sources, removeSelector, idGen: makeIdGen() })

  const collectionStream =
    actions
      .fold((col, action) => action(col), emptyCol)
      .map(col => col.asArray())

  const removes = Collection.merge(collectionStream, item => item._remove)
  removeProxy.imitate(removes)

  return collectionStream
}

function addToCollection(extraSources, coll) {
  if (Array.isArray(extraSources))
    return extraSources.reduce((collection, sources) => collection.add(sources), coll)
  return coll.add(extraSources)
}

function removeFromCollection(item, coll) { return coll.remove(item) }

function clearCollection(coll) { return coll.clear() }

function assignKey(x) {
   return isVtree(x) && x.key == null ? assign(x, { key }) : x
}

function memoizeStream(fn) {
  const cache = {}
  return function(item) {
    const key = item._id
    if (cache[key] === undefined) { cache[key] = fn(item) }
    return cache[key]
  }
}

Collection.pluck = function(collectionStream, pluckSelector) {

  const pluck = (item) =>
    pluckSelector(item).map(assignKey).remember()

  const plucked = memoizeStream(pluck)

  const outputStream =
    collectionStream
      .map(items => items.map(item => plucked(item)))
      .map(sinkStreams => xs.combine(...sinkStreams))
      .flatten()
      .startWith([])

  return outputStream
}

Collection.merge = function(collectionStream, mergeSelector) {

  const merge = (item) =>
    xs.merge(mergeSelector(item).map(assignKey), xs.never())

  const merged = memoizeStream(merge)

  const outputStream =
    collectionStream
      .map(items => items.map(item => merged(item)))
      .map(sinkStreams => xs.merge(...sinkStreams))
      .flatten()

  return outputStream
}

export default Collection
