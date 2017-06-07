import xs from 'xstream'
import delay from 'xstream/extra/delay'

import { log, sample, bind } from '../utils'

import { Repo } from "../repo"

export function intent({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> }) {

  const queries = Repo.setup(
    Repo.get("/get<%= itemNameU %>", "get<%= itemNameU %>").now(),
    Repo.post("/save<%= itemNameU %>", "save<%= itemNameU %>").on(new<%= itemNameU %>),
    Repo.post('/edit<%= itemNameU %>', 'edit<%= itemNameU %>').on(edit<%= itemNameU %>),
  )(HTTP)

  const loaded<%= itemNameU %> = queries.responses.get<%= itemNameU %>.map(<%= itemNameL %> => xs.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>SaveSuccess = queries.responses.save<%= itemNameU %>
  const <%= itemNameL %>EditSuccess = queries.responses.edit<%= itemNameU %>

  const actions = queries.actions
  const add<%= itemNameU %> = xs.merge(sample(new<%= itemNameU %>, <%= itemNameL %>SaveSuccess), loaded<%= itemNameU %>)

  return { actions, requests: queries.requests, add<%= itemNameU %>, <%= itemNameL %>EditSuccess }
}
