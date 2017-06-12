import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource, VNode } from '@cycle/dom';
import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'


interface Collection {
  (component: Function, sources?: { DOM?:DOMSource, HTTP?:HTTPSource },
   adds?: Stream<any>, removeSelector?: Function, clears?: Stream<any>): any
  merge: Function
  pluck:Function
}

interface CollectionStream {
  DOM:DOMSource
  edits?:Stream<any>
  remove?:Stream<any>
  _id?:number
  _name?:string
  _remove?:Stream<any>
}

interface Sources {
  DOM:DOMSource
  _idx:Stream<Number>
  [itemName:string]:any
}

interface Config {
  component:Function
  sources: { DOM?:DOMSource, HTTP?:HTTPSource }
  idGen:Function
  removeSelector:any
}

interface CollectMethods {
  add:Function
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

const assign:Function = Object.assign
const bind:Function = (fn:Function, ...args) => fn.bind(this, ...args)
const noop:Function = Function.prototype()

const isVtree = (x:any):Boolean =>
  x && typeof x.sel === 'string'

function makeIdGen(): () => number {
  let ids = 0
  return () => ids++
}

function makeItem(component, sources:Sources, idGen:Function):NewItem {
  console.log(`component`, component)
  console.log(`sources`, sources)
  sources.pets.addListener({
    next: i => console.log(`petsItem`, i)
  })
  const newId:number = idGen()
  const newItem:NewItem = isolate(component, newId.toString())(sources)
  newItem._id = newId
  newItem._name = component.name
  return newItem
}

function collection(config:Config, items = []):CollectMethods {
  const { component, sources, idGen, removeSelector }:Config = config
  return {
    add(extraSources = {}):CollectMethods {
      const newItem:NewItem = makeItem(component, assign({}, sources, extraSources, { _idx: Stream.of(items.length) }), idGen)
      newItem._remove = typeof removeSelector === 'function' ? removeSelector(newItem).take(1).mapTo(newItem) : Stream.empty()
      return collection(config, items.concat(newItem))
    },
    remove(item:CollectionStream):CollectMethods {
      return collection(config, items.filter(x => x !== item))
    },
    asArray():Array<Function> { return items.slice() },
    clear():CollectMethods {
      return collection(config)
    }
  }
}

const Collection = <Collection>function(component, sources = {}, adds = Stream.empty(), removeSelector = noop, clears = Stream.empty()):Stream<Array<CollectionStream>> {

  const addActions:Stream<Function> = adds.map(extraSources => bind(addToCollection, extraSources))

  const removeProxy:Stream<{}> = Stream.create()
  const removeActions:Stream<Function> = removeProxy.map(item => bind(removeFromCollection, item))
  const clearActions:Stream<Function> = clears.mapTo(clearCollection)

  const actions:Stream<Function> = Stream.merge(addActions, removeActions, clearActions)
  const emptyCol:CollectMethods = collection({ component, sources, removeSelector, idGen: makeIdGen() })

  const collectionStream:Stream<Array<CollectionStream>> =
    actions
      .fold((col, action) => action(col), emptyCol)
      .map(col => col.asArray())

  const removes:Stream<Array<CollectionStream>> = Collection.merge(collectionStream, item => item._remove)

  removeProxy.imitate(removes)

  return collectionStream
}

function addToCollection(extraSources:{ [x:string]: Stream<any>}, coll:CollectMethods):CollectMethods {
  if (Array.isArray(extraSources)){
    const test = extraSources.reduce((collection, sources) => collection.add(sources), coll)
    test.addListener({
      next: i => console.log(`test`, i)
    })
    return test
  }
  return coll.add(extraSources)
}

function removeFromCollection(item:CollectionStream, coll:CollectMethods):CollectMethods { return coll.remove(item) }

function clearCollection(coll:CollectMethods):CollectMethods { return coll.clear() }

function assignKey(x:VNode):VNode { return isVtree(x) && x.key == null ? assign(x, { key }) : x }

function memorizeStream(fn:Function):Function {
  const cache:Object = {}
  return function(item:CollectionStream):{ [x:string]:Stream<Function> } {
    const key:number = item._id
    if (cache[key] === undefined) { cache[key] = fn(item) }
    return cache[key]
  }
}

Collection.pluck = function(collectionStream:Stream<Array<{ [x:number]:CollectionStream }>>, pluckSelector:Function):Stream<Array<{ [x:number]:VNode }>> {

  const pluck = (item:CollectionStream):Stream<VNode> => pluckSelector(item).map(assignKey).remember()

  const plucked:Function = memorizeStream(pluck)

  const outputStream:Stream<Array<{ [x:number]:VNode }>> =
    collectionStream
      .map(items => items.map(item => plucked(item)))
      .map(sinkStreams => Stream.combine(...sinkStreams))
      .flatten()
      .startWith([])

  return outputStream
}

Collection.merge = function(collectionStream, mergeSelector):Stream<Array<{}>> {

  const merge = (item:CollectionStream):Stream<VNode> =>
    Stream.merge(mergeSelector(item).map(assignKey), Stream.never())

  const merged:Function = memorizeStream(merge)

  const outputStream:Stream<Array<{}>> =
    collectionStream
      .map(items => items.map(item => merged(item)))
      .map(sinkStreams => Stream.merge(...sinkStreams))
      .flatten()

  return outputStream
}

export default Collection
