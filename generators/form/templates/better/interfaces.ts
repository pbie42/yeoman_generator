import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http'
import { DOMSource, VNode } from '@cycle/dom'

export interface State {
  name: string,
  email: string,
  password: string
}

export interface Sources {
  DOM:DOMSource,
  HTTP:HTTPSource
}

export interface FormSinks {
  DOM: Stream<VNode>,
  HTTP: Stream<any>,
  history: Stream<string>,
  newSubmit: Stream<any>
}

export interface Data {
  name:string
  email:string
  password:string
}

export interface Queries {
  responses: { submitForm:Stream<{}> }
  actions: Stream<Function>
  requests:Stream<{ submitForm: { status:string } }>
}

export interface Intent {
  actions:Stream<Function>
  requests:Stream<{ submitForm: { status:string } }>
  submitSuccess:Stream<{}>
}

export interface Model {
  states:Stream<State>
  newSubmit:Stream<State>
}
