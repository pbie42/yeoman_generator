import { Stream } from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import { Repo } from "./repo"
import { ListIntent, Sources, Query, Queries, State, StatePeel } from '../interfaces'


export function intent({ DOM, HTTP}:Sources, <%= itemNameU %>:Stream<State>, edit<%= itemNameU %>:Stream<State>):ListIntent {

  const queries:Queries = Repo.setup(
    Repo.get("/get<%= itemNameU %>", "get<%= itemNameU %>").now(),
    Repo.post("/save<%= itemNameU %>", "save<%= itemNameU %>").on(new<%= itemNameU %>),
    Repo.post('/edit<%= itemNameU %>', 'edit<%= itemNameU %>').on(edit<%= itemNameU %>),
  )(HTTP)

  const loaded<%= itemNameU %>:Stream<StatePeel> = queries.responses.get<%= itemNameU %>.map(<%= itemNameL %> => Stream.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>EditSuccess:Stream<StatePeel> = queries.responses.edit<%= itemNameU %>.map(<%= itemNameL %> => Stream.of(...<%= itemNameL %>)).flatten()
  const <%= itemNameL %>SaveSuccess:Stream<Array<StatePeel>> = queries.responses.save<%= itemNameU %>

  const actions:Stream<Function> = queries.actions
  const add<%= itemNameU %>:Stream<StatePeel | {}> = Stream.merge(sampleOnion(new<%= itemNameU %>, <%= itemNameL %>SaveSuccess), loaded<%= itemNameU %>, <%= itemNameL %>EditSuccess)

  return { actions, requests: queries.requests, add<%= itemNameU %> }
}

export const sampleOnion = (source, trigger) => {
  return trigger.compose(sampleCombine(source)).map(([_, value]) => {
    return Object.assign({}, value.<%= itemNameL %>)
  })
}