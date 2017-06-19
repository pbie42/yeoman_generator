import { Stream } from 'xstream'
import { StateSource } from 'cycle-onionify'
import { HTTPSource } from '@cycle/http'
import { DOMSource, VNode } from '@cycle/dom'

export type Reducer = (prev?: State) => State | undefined

export interface State {
  <%= itemNameL %>: {<% inputs.forEach(i => { %>
    <%= i %>:string<% }) %>
    id?:number
  }
}

export interface StatePeel {<% inputs.forEach(i => { %>
    <%= i %>:string<% }) %>
}

export interface StatePiece { <%= itemNameL %>: { [x:string]:string } }



export interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
  HTTP:HTTPSource
}

export interface Query {
  method:string
  url:string
  category:string
}

export interface Queries {
  responses: {
    get<%= itemNameU %>: Stream<StatePeel[]>
    save<%= itemNameU %>: Stream<StatePeel[]>
    edit<%= itemNameU %>: Stream<StatePeel[]>
  }
  actions: Stream<Function>
  requests: Stream<Query>
}

export interface Sinks {
  DOM: Stream<VNode>
  HTTP: Stream<Query>
  history: Stream<String>
  onion: Stream<{} | Reducer>
}

export interface ListState {
  requests: {
    edit<%= itemNameU %>?: { status:string }
    get<%= itemNameU %>?: { status:string }
    save<%= itemNameU %>?: { status:string }
  }
}

export interface Data {<% inputs.forEach(i => { %>
    <%= i %>:string<% }) %>
  id:number
}

//------------------FORM--------------------------------------------------------

export interface FormSinks {
  DOM:Stream<VNode>
  HTTP:Stream<Query>
  history:Stream<String>
  onion:Stream<Reducer>
  new<%= itemNameU %>:Stream<State>
  edit<%= itemNameU %>:Stream<State>
}

export interface FormModel {
  updater:Stream<Reducer>
  reducer:Stream<Reducer>
  edit:Stream<Boolean>
}

export interface FormIntent {
   actions:Stream<StatePiece>
   submitter:Stream<null>
   editor:Stream<null>
}

//------------------LIST--------------------------------------------------------

export interface ListSinks {
  DOM: Stream<VNode>
  HTTP: Stream<Query>
  onion: Stream<Reducer>
  history:Stream<String>
  edits:Stream<Data[]>
}

export interface ListIntent {
  actions:Stream<Function>
  requests: Stream<Query>
  add<%= itemNameU %>:Stream<StatePeel | {}>
}

//------------------ITEM--------------------------------------------------------

export interface ItemSources {
  DOM:DOMSource
  <%= itemNameL %>: Stream<StatePeel>
  _idx:Stream<number>
}

export interface ItemSinks {
  DOM:Stream<VNode>
  remove:Stream<null>
  edits:Stream<Data>
}