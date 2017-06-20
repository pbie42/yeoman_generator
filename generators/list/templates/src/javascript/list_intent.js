import xs from 'xstream'
import delay from 'xstream/extra/delay'

import { log, sample, bind } from '../utils'

import { Repo } from "../repo"

export function intent({ DOM, HTTP }, removeProxy) {

  const queries = Repo.setup(
    Repo.get("/get<%= itemNameU %>", "get<%= itemNameU %>").now(),
    Repo.post("/remove<%= itemNameU %>", "remove<%= itemNameU %>").on(removeProxy)
  )(HTTP)

  const loaded<%= itemNameU %> = queries.responses.get<%= itemNameU %>.map(<%= itemNameL %> => xs.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>RemoveSuccess = queries.responses.remove<%= itemNameU %>

  const actions = queries.actions
  const add<%= itemNameU %> = xs.merge(loaded<%= itemNameU %>)

  return { actions, requests: queries.requests, add<%= itemNameU %>, <%= itemNameL %>RemoveSuccess }
}
