import xs from 'xstream'

import { log, sample, bind, assign } from './utils'

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

function getNow(url, category) {
  const request = { method: 'GET', url, category }
  return bind(genQuery, category, request, xs.of.bind(xs))
}

function getOn(url, category, stream) {
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

function postNow(url, category, data) {
  const request = postRequest(url, category, data)
  return bind(genQuery, category, request, xs.of.bind(xs))
}

function postOn(url, category, stream) {
  const request = bind(postRequest, url, category)
  const streamCtrs = {
    request: stream.map.bind(stream),
    action: stream.mapTo.bind(stream)
  }
  return bind(genQuery, category, request, streamCtrs)
}

function queryBuilder(url, category, nowFn, onFn) {
  return {
    now() { return nowFn(url, category) },
    on(stream) { return onFn(url, category, stream) }
  }
}

export const Repo = {
  setup(...queryCtrs) {
    return (HTTP) => {
      const queries = queryCtrs.map(ctr => ctr(HTTP))
      return {
        actions: xs.merge(...queries.reduce((all, next) => all.concat(next.actions), [])),
        requests: xs.merge(...queries.map(q => q.request)),
        responses: queries.reduce((all, next) => assign(all, next.response), {})
      }
    }
  },
  get(url, category) {
    return queryBuilder(url, category, getNow, getOn)
  },
  post(url, category) {
    return queryBuilder(url, category, postNow, postOn)
  }
}
