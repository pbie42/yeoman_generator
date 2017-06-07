import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http'

import { log, sample, bind, assign } from '../utils'

export const Status = { pending: { status: "Pending" }, success: { status: "Success" }, failure: { status: "Failure" } }

function startQuery(category, state) {
  return assign({}, state, { requests:  assign({}, state.requests, { [category]: Status.pending }) } )
}

function querySuccess(category, state) {
  return assign({}, state, { requests:  assign({}, state.requests, { [category]: Status.success }) } )
}

function queryFailure(category, state) {
  return assign({}, state, { requests:  assign({}, state.requests, { [category]: Status.failure }) } )
}

function getStreamCtr(streamArg) {
  if (typeof streamArg == "function") { return [ streamArg, streamArg ] }
  return [ streamArg.request, streamArg.action ]
}

function genQuery(category, request, streamArg, HTTP) {
  const response = HTTP.select(category).flatten().map(resp => JSON.parse(resp.text))
  const [requestStreamCtr, actionStreamCtr] = getStreamCtr(streamArg)
  const query = {
    request: requestStreamCtr(request),
    actions: [
      actionStreamCtr(bind(startQuery, category)),
      response.mapTo(bind(querySuccess, category))
    ],
    response: { [category]: response }
  }
  return query
}

function getNow(url:string, category:string) {
  const request = { method: 'GET', url, category }
  return bind(genQuery, category, request, Stream.of.bind(Stream))
}

function getOn(url:string, category:string, stream:Stream<any>) {
  const request = { method: 'GET', url, category }
  return bind(genQuery, category, request, stream.mapTo.bind(stream))
}

function postRequest(url, category, data) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    url, category,
    send: data,
  }
}

function postNow(url:string, category:string, data:Stream<any>) {
  const request = postRequest(url, category, data)
  return bind(genQuery, category, request, Stream.of.bind(Stream))
}

function postOn(url, category, stream) {
  const request = bind(postRequest, url, category)
  const streamCtrs = {
    request: stream.map.bind(stream),
    action: stream.mapTo.bind(stream)
  }
  return bind(genQuery, category, request, streamCtrs)
}

function queryBuilder(url:string, category:string, nowFn:Function, onFn:Function) {
  return {
    now() { return nowFn(url, category) },
    on(stream) { return onFn(url, category, stream) }
  }
}

export const Repo = {
  setup(...queryCtrs) {
    return (HTTP:HTTPSource) => {
      const queries = queryCtrs.map(ctr => ctr(HTTP))
      return {
        actions: Stream.merge(...queries.reduce((all, next) => all.concat(next.actions), [])),
        requests: Stream.merge(...queries.map(q => q.request)),
        responses: queries.reduce((all, next) => assign(all, next.response), {})
      }
    }
  },
  get(url:string, category:string) {
    return queryBuilder(url, category, getNow, getOn)
  },
  post(url:string, category:string) {
    return queryBuilder(url, category, postNow, postOn)
  }
}
