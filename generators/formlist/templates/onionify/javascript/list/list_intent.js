import xs from 'xstream'
import delay from 'xstream/extra/delay'
import sampleCombine from 'xstream/extra/sampleCombine'

import { Repo } from "./repo"

export function intent({ DOM, HTTP, new<%= itemNameU %>, edit<%= itemNameU %> }) {

  const queries = Repo.setup(
    Repo.get("/get<%= itemNameU %>", "get<%= itemNameU %>").now(),
    Repo.post("/save<%= itemNameU %>", "save<%= itemNameU %>").on(new<%= itemNameU %>),
    Repo.post('/edit<%= itemNameU %>', 'edit<%= itemNameU %>').on(edit<%= itemNameU %>),
  )(HTTP)

  const loaded<%= itemNameU %> = queries.responses.get<%= itemNameU %>.map(<%= itemNameL %> => xs.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>EditSuccess = queries.responses.edit<%= itemNameU %>.map(<%= itemNameL %> => xs.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>SaveSuccess = queries.responses.save<%= itemNameU %>

  const actions = queries.actions
  const add<%= itemNameU %> = xs.merge(sampleOnion(new<%= itemNameU %>, <%= itemNameL %>SaveSuccess), loaded<%= itemNameU %>, <%= itemNameL %>EditSuccess)

  return { actions, requests: queries.requests, add<%= itemNameU %> }
}

export const sampleOnion = (source, trigger) => {
  return trigger.compose(sampleCombine(source)).map(([_, value]) => {
    return Object.assign({}, value.<%= itemNameL %>)
  })
}