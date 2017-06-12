import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource, VNode } from '@cycle/dom';

export interface Query {
  method:string
  url:string
  category:string
}

export interface Queries {
  responses: {
    get<%= itemNameU %>: Stream<State[]>
    save<%= itemNameU %>: Stream<State[]>
    edit<%= itemNameU %>: Stream<State[]>
  }
  actions: Stream<Function>
  requests: Stream<Query>
}

export interface Sources {
  DOM:DOMSource
  HTTP:HTTPSource
}

export interface Sinks {
  DOM: Stream<VNode>
  HTTP: Stream<Query>
  history: Stream<String>
}

export interface State {<% inputs.forEach(i => { %>
  <%= i %>: string, <% }) %>
}

export interface ListState {
  requests: {
    edit<%= itemNameU %>?: { status:string }
    get<%= itemNameU %>?: { status:string }
    save<%= itemNameU %>?: { status:string }
  }
}

export interface Data {<% inputs.forEach(i => { %>
  <%= i %>: string, <% }) %>
  id:number
}

export interface FormStates {
  states:Stream<State>,
  new<%= itemNameU %>:Stream<State>,
  edit<%= itemNameU %>:Stream<State>
}

export interface FormSinks {
  DOM:Stream<VNode>,
  HTTP:Stream<Query>,
  history:Stream<String>,
  new<%= itemNameU %>:Stream<State>,
  edit<%= itemNameU %>:Stream<State>
}

export interface FormIntent {
   actions:Stream<Function | {}>
}

export interface ListSources {
  DOM:DOMSource,
  HTTP:HTTPSource,
  new<%= itemNameU %>:Stream<State>,
  edit<%= itemNameU %>:Stream<State>
}

export interface ListSinks {
  DOM: Stream<VNode>
  HTTP: Stream<Query>
  history:Stream<String>
  edits:Stream<Data[]>
}

export interface ListIntent {
  actions:Stream<Function>
  requests: Stream<Query>
  add<%= itemNameU %>:Stream<State | {}>
  <%= itemNameL %>EditSuccess:Stream<Array<State>>
}

export interface ItemSources {
  DOM:DOMSource
  <%= itemNameL %>: Stream<State>
  _idx:Stream<number>
}

export interface ItemSinks {
  DOM:Stream<VNode>
  remove:Stream<null>
  edits:Stream<Data>
}