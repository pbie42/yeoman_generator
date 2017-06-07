import { Stream } from 'xstream'

import { log, sample, bind } from './utils'

import { Repo } from "./repo"
import { ListSources } from './_<%= listName %>'

export function intent({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> }:ListSources) {

  const queries = Repo.setup(
    Repo.get("/get<%= itemNameU %>", "get<%= itemNameU %>").now(),
    Repo.post("/save<%= itemNameU %>", "save<%= itemNameU %>").on(new<%= itemNameU %>),
    Repo.post('/edit<%= itemNameU %>', 'edit<%= itemNameU %>').on(edit<%= itemNameU %>),
  )(HTTP)

  const loaded<%= itemNameU %> = queries.responses.get<%= itemNameU %>.map(<%= itemNameL %> => Stream.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>SaveSuccess = queries.responses.save<%= itemNameU %>
  const <%= itemNameL %>EditSuccess = queries.responses.edit<%= itemNameU %>

  const actions = queries.actions
  const add<%= itemNameU %> = Stream.merge(sample(new<%= itemNameU %>, <%= itemNameL %>SaveSuccess), loaded<%= itemNameU %>)

  return { actions, requests: queries.requests, add<%= itemNameU %>, <%= itemNameL %>EditSuccess }
}
