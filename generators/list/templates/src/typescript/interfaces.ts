import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http'
import { DOMSource, VNode } from '@cycle/dom'

export interface ListSources {
  DOM: DOMSource
  HTTP: HTTPSource
}

export interface ListSinks {
  DOM: Stream<VNode>
  HTTP: Stream<any>
  history: Stream<string>
}

export interface ListIntent {
  actions: Stream<Function>
  requests: Stream<{ get<%= itemNameU %>: { status:string } }>
  add<%= itemNameU %>: Stream<{ Data }>
  <%= itemNameL %>RemoveSuccess: Stream<Array<Data>>
}

export interface Data {<% inputs.forEach(i => { %>
        <%= i %>:string<% }) %>
}

export interface Model {
   states:Stream<ViewState>
}

export interface ViewState {
  requests: {
      get<%= itemNameU %>: { status:string }
      remove<%= itemNameU %>: { status:string }
  }
}

export interface State {
    get<%= itemNameU %>:Stream<Array<{ Data }>>
    remove<%= itemNameU %>:Stream<Array<Data>>
}

export interface Queries {
  responses: State
  actions: Stream<Function>
  requests:Stream<{ get<%= itemNameU %>: { status:string } }>
}

export interface ItemSources {
  DOM:DOMSource
  <%= itemNameL %>:Stream<Data>
  _idx: Stream<number>
}

export interface ItemSinks {
  DOM: Stream<VNode>
  remove: Stream<Event>
  remove<%= itemNameU %>: Stream<{ Data }>
}