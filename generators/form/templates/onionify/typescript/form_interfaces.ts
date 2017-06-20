import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http'
import { StateSource } from 'cycle-onionify'
import { DOMSource, VNode } from '@cycle/dom'

export type Reducer = (prev?: State) => State | undefined;

export interface StatePiece { [x:string]:string }

export interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
  HTTP: HTTPSource
}

export interface State {<% inputs.forEach(i => { %>
    <%= i %>:string<% }) %>
}

export interface Sinks {
  DOM: Stream<VNode>
  HTTP: Stream<Query>
  history: Stream<String>
  onion: Stream<{} | Reducer>
  newSubmit: Stream<State>
}

//----------------------------Intent--------------------------------------------

export interface Query {
  method:string
  url:string
  category:string
}

export interface Queries {
  responses: {
    submitForm: Stream<State[]>
  }
  actions: Stream<Function>
  requests: Stream<Query>
}

export interface Intent {
  actions:Stream<StatePiece>
  submitter:Stream<null>
  requests: Stream<Query>
  submitSuccess:Stream<State[]>
}