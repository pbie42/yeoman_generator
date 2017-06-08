import { Stream } from 'xstream'
import { HTTPSource } from '@cycle/http'

import { log, sample, bind, assign } from '../utils'

interface PostRequest {
    method:string
    headers:{ 'Content-Type':string }
    url:string
    category:string
    send:Stream<any>
  }

interface GetRequest {
  method:string
  url:string
  category:string
}

interface NowOn {
  now:Function
  on:Function
}

interface RequestAction {
  request:Stream<Function>
  action:Stream<Function>
}

interface Status {
  pending: {
    status:string
  }
  success: {
    status:string
  } 
  failure: {
    status:string
  }
}

interface State {
  requests: {
    [id: string]: {
      status:string
    }
  }
}

type StreamArg = { request, action} | Function

export const Status:Status = { pending: { status: "Pending" }, success: { status: "Success" }, failure: { status: "Failure" } }

function startQuery(category:string, state:{ requests }):State {
  return assign({}, state, { requests: assign({}, state.requests, { [category]: Status.pending }) } )
}

function querySuccess(category:string, state):State {
  return assign({}, state, { requests: assign({}, state.requests, { [category]: Status.success }) } )
}

function queryFailure(category:string, state):State {
  return assign({}, state, { requests: assign({}, state.requests, { [category]: Status.failure }) } )
}

function getStreamCtr(streamArg:StreamArg):Array<Function> {
  if (typeof streamArg == "function") { return [ streamArg, streamArg ] }
  return [ streamArg.request, streamArg.action ]
}

interface GenQuery {
  request:any
  actions:any[]
  response: {
    [x:string]:Stream<HTTPSource>
  }
}

function genQuery(category:string, request:PostRequest | GetRequest, streamArg:StreamArg, HTTP:HTTPSource):GenQuery {
  const response:Stream<HTTPSource> = HTTP.select(category).flatten().map(resp => JSON.parse(resp.text))
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

function getNow(url:string, category:string):Function {
  const request:GetRequest = { method: 'GET', url, category }
  return bind(genQuery, category, request, Stream.of.bind(Stream))
}

function getOn(url:string, category:string, stream:Stream<any>):Function {
  const request:GetRequest = { method: 'GET', url, category }
  return bind(genQuery, category, request, stream.mapTo.bind(stream))
}

function postRequest(url, category, data):PostRequest {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    url, category,
    send: data,
  }
}

function postNow(url:string, category:string, data:Stream<any>):Function {
  const request:PostRequest = postRequest(url, category, data)
  return bind(genQuery, category, request, Stream.of.bind(Stream))
}

function postOn(url:string, category:string, stream:Stream<any>):Function {
  const request:PostRequest = bind(postRequest, url, category)
  const streamCtrs:RequestAction = {
    request: stream.map.bind(stream),
    action: stream.mapTo.bind(stream)
  }
  return bind(genQuery, category, request, streamCtrs)
}

function queryBuilder(url:string, category:string, nowFn:Function, onFn:Function):NowOn {
  return {
    now():Function { return nowFn(url, category) },
    on(stream):Function { return onFn(url, category, stream) }
  }
}

export const Repo = {
  setup(...queryCtrs):Function {
    return (HTTP:HTTPSource) => {
      const queries = queryCtrs.map(ctr => ctr(HTTP))
      return {
        actions: Stream.merge(...queries.reduce((all, next) => all.concat(next.actions), [])),
        requests: Stream.merge(...queries.map(q => q.request)),
        responses: queries.reduce((all, next) => assign(all, next.response), {})
      }
    }
  },
  get(url:string, category:string):NowOn {
    return queryBuilder(url, category, getNow, getOn)
  },
  post(url:string, category:string):NowOn {
    return queryBuilder(url, category, postNow, postOn)
  }
}
