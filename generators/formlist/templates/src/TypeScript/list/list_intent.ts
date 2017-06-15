import { Stream } from 'xstream'

import { Repo } from "./repo"
import { log, sample } from './utils'
import { ListIntent, ListSources, Query, Queries, State } from '../interfaces'


export function intent({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> }:ListSources):ListIntent {

  const queries:Queries = Repo.setup(
    Repo.get("/get<%= itemNameU %>", "get<%= itemNameU %>").now(),
    Repo.post("/save<%= itemNameU %>", "save<%= itemNameU %>").on(new<%= itemNameU %>),
    Repo.post('/edit<%= itemNameU %>', 'edit<%= itemNameU %>').on(edit<%= itemNameU %>),
  )(HTTP)

  const loaded<%= itemNameU %>:Stream<State> = queries.responses.get<%= itemNameU %>.map(<%= itemNameL %> => Stream.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>EditSuccess:Stream<Array<State>> = queries.responses.edit<%= itemNameU %>.map(<%= itemNameL %> => Stream.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>SaveSuccess:Stream<Array<State>> = queries.responses.save<%= itemNameU %>

  const actions:Stream<Function> = queries.actions
  const add<%= itemNameU %>:Stream<State | {}> = Stream.merge(sample(new<%= itemNameU %>, <%= itemNameL %>SaveSuccess), loaded<%= itemNameU %>, <%= itemNameL %>EditSuccess)

  return { actions, requests: queries.requests, add<%= itemNameU %> }
}
