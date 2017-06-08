import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource } from '@cycle/dom';
import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'


interface Collection {
  (component: Function, sources?: { DOM?:DOMSource, HTTP?:HTTPSource },
   adds?: Stream<any>, removeSelector?: any, clears?: Stream<any>): any
  merge: Function
  pluck:Function
}

interface Config {
  component:Function
  sources: { DOM?:DOMSource, HTTP?:HTTPSource }
  idGen:Function
  removeSelector:any
}

interface CollectMethods {
  add: Function
  remove:Function
  asArray:Function
  clear:Function
}

interface NewItem {
  (): any
  _id:number
  _name:string
  _remove?:Stream<any>
}

const assign = Object.assign
const bind:(fn, ...args) => any = (fn, ...args) => fn.bind(this, ...args)
const noop:Function = Function.prototype()

const isVtree:Function = (x:any):Boolean =>
  x && typeof x.sel === 'string'

function makeIdGen(): () => number {
  let ids = 0
  return () => ids++
}

function makeItem(component, sources, idGen:Function):NewItem {
  const newId:number = idGen()
  const newItem:NewItem = isolate(component, newId.toString())(sources)
  newItem._id = newId
  newItem._name = component.name
  return newItem
}

function collection(config, items = []):CollectMethods {
  const { component, sources, idGen, removeSelector }:Config = config
  return {
    add(extraSources = {}):CollectMethods {
      const newItem:NewItem = makeItem(component, assign({}, sources, extraSources, { _idx: Stream.of(items.length) }), idGen)
      newItem._remove = removeSelector(newItem).take(1).mapTo(newItem) || Stream.empty()
      return collection(config, items.concat(newItem))
    },
    remove(item):CollectMethods {
      return collection(config, items.filter(x => x !== item))
    },
    asArray():Array<Function> { return items.slice() },
    clear():CollectMethods {
      return collection(config)
    }
  }
}

const Collection = <Collection>function(component, sources = {}, adds = Stream.empty(), removeSelector = noop, clears = Stream.empty()):Stream<Array<any>> {

  const addActions:Stream<Function> = adds.map(extraSources => bind(addToCollection, extraSources))

  const removeProxy:Stream<{}> = Stream.create()
  const removeActions:Stream<any> = removeProxy.map(item => bind(removeFromCollection, item))
  const clearActions:Stream<Function> = clears.mapTo(clearCollection)

  const actions:Stream<any> = Stream.merge(addActions, removeActions, clearActions)
  const emptyCol:CollectMethods = collection({ component, sources, removeSelector, idGen: makeIdGen() })

  const collectionStream:Stream<Array<any>> =
    actions
      .fold((col, action) => action(col), emptyCol)
      .map(col => col.asArray())

  const removes:Stream<Array<any>> = Collection.merge(collectionStream, item => item._remove)
  removeProxy.imitate(removes)

  return collectionStream
}

function addToCollection(extraSources, coll):Array<any> {
  if (Array.isArray(extraSources))
    return extraSources.reduce((collection, sources) => collection.add(sources), coll)
  return coll.add(extraSources)
}

function removeFromCollection(item, coll):Array<any> { return coll.remove(item) }

function clearCollection(coll):Array<null> { return coll.clear() }

function assignKey(x) {
   return isVtree(x) && x.key == null ? assign(x, { key }) : x
}

function memorizeStream(fn:Function):Function {
  const cache:Object = {}
  return function(item):{ [x:string]:Function } {
    const key:number = item._id
    if (cache[key] === undefined) { cache[key] = fn(item) }
    return cache[key]
  }
}

Collection.pluck = function(collectionStream:Stream<any>, pluckSelector:Function):Stream<Array<any>> {

  const pluck:(item:NewItem) => Stream<any> = (item) =>
    pluckSelector(item).map(assignKey).remember()

  const plucked:Function = memorizeStream(pluck)

  const outputStream:Stream<Array<any>> =
    collectionStream
      .map(items => items.map(item => plucked(item)))
      .map(sinkStreams => Stream.combine(...sinkStreams))
      .flatten()
      .startWith([])

  return outputStream
}

Collection.merge = function(collectionStream, mergeSelector):Stream<Array<any>> {

  const merge:(item:NewItem) => Stream<any> = (item) =>
    Stream.merge(mergeSelector(item).map(assignKey), Stream.never())

  const merged:Function = memorizeStream(merge)

  const outputStream:Stream<Array<any>> =
    collectionStream
      .map(items => items.map(item => merged(item)))
      .map(sinkStreams => Stream.merge(...sinkStreams))
      .flatten()

  return outputStream
}

export default Collection
