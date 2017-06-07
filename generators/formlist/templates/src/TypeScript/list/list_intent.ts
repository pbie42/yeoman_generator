import { Stream } from 'xstream'

import { Repo } from "./repo"
import { log, sample } from './utils'
import { ListIntent, ListSources, Query } from '../interfaces'


export function intent({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> }:ListSources):ListIntent {

  const queries = Repo.setup(
    Repo.get("/get<%= itemNameU %>", "get<%= itemNameU %>").now(),
    Repo.post("/save<%= itemNameU %>", "save<%= itemNameU %>").on(new<%= itemNameU %>),
    Repo.post('/edit<%= itemNameU %>', 'edit<%= itemNameU %>').on(edit<%= itemNameU %>),
  )(HTTP)

  const loaded<%= itemNameU %>:Query = queries.responses.get<%= itemNameU %>.map(<%= itemNameL %> => Stream.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>SaveSuccess:Query = queries.responses.save<%= itemNameU %>
  const <%= itemNameL %>EditSuccess:Query = queries.responses.edit<%= itemNameU %>

  const actions:Query = queries.actions
  const add<%= itemNameU %>:Stream<Array<{}> | {}> = Stream.merge(sample(new<%= itemNameU %>, <%= itemNameL %>SaveSuccess), loaded<%= itemNameU %>)

  return { actions, requests: queries.requests, add<%= itemNameU %>, <%= itemNameL %>EditSuccess }
}
