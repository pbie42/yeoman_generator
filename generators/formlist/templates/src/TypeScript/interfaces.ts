import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http';
import { DOMSource, VNode } from '@cycle/dom';

export type Query = Stream<Array<{}>>

export interface Sources {
  DOM:DOMSource,
  HTTP:HTTPSource
}

export interface Sinks {
  DOM: Stream<VNode>,
  HTTP: Stream<any>,
  history: Stream<any>,
}

export interface State {<% inputs.forEach(i => { %>
  <%= i %>: string, <% }) %>
}

export interface FormStates {
  states:Stream<State>,
  new<%= itemNameU %>:Stream<State>,
  edit<%= itemNameU %>:Stream<State>
}

export interface FormSinks {
  DOM:Stream<VNode>,
  HTTP:Stream<any>,
  history:Stream<any>,
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
  DOM: Stream<VNode>,
  HTTP: Stream<any>,
  history:Stream<any>,
  edits:Stream<any>
}

export interface ListIntent {
  actions: Query,
  requests: Query,
  add<%= itemNameU %>: Stream<Array<{}> | {}>,
  <%= itemNameL %>EditSuccess: Query
}

export interface ItemSources {
  DOM:DOMSource,
  <%= itemNameL %>: Stream<State>,
  _idx:Stream<number>
}

export interface ItemSinks {
  DOM:Stream<VNode>,
  remove:Stream<null>,
  edits:Stream<State>
}