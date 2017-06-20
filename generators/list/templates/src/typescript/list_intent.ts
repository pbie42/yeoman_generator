import { Stream } from 'xstream'
import delay from 'xstream/extra/delay'

import { log, sample, bind } from '../utils'

import { Repo } from "../repo"
import { ListSources, ListIntent, Queries, Data } from './interfaces'

export function intent({ DOM, HTTP }:ListSources, removeProxy:Stream<any>):ListIntent {

  const queries:Queries = Repo.setup(
    Repo.get("/get<%= itemNameU %>", "get<%= itemNameU %>").now(),
    Repo.post("/remove<%= itemNameU %>", "remove<%= itemNameU %>").on(removeProxy)
  )(HTTP)

  const loaded<%= itemNameU %>: Stream<{ Data }> = queries.responses.get<%= itemNameU %>.map(<%= itemNameL %> => Stream.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>RemoveSuccess: Stream<Array<Data>> = queries.responses.remove<%= itemNameU %>

  const actions:Stream<Function> = queries.actions
  const add<%= itemNameU %>:Stream<{ Data }> = loaded<%= itemNameU %>

  return { actions, requests: queries.requests, add<%= itemNameU %>, <%= itemNameL %>RemoveSuccess }
}
