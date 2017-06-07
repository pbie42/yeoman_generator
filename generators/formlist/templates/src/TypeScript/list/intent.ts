import { Stream } from 'xstream'
import delay from 'xstream/extra/delay'

import { Repo } from "../../repo"
import { log, sample, bind } from '../../../utils'
import { ListIntent, ListSources, Query } from '../interfaces'


export function intent({ DOM, HTTP, newPeople, editPeople }:ListSources):ListIntent {

  const queries = Repo.setup(
    Repo.get("/getPeople", "getPeople").now(),
    Repo.post("/savePeople", "savePeople").on(newPeople),
    Repo.post('/editPeople', 'editPeople').on(editPeople),
  )(HTTP)

  const loadedPeople:Query = queries.responses.getPeople.map(people => Stream.of(...people)).flatten()
  const peopleSaveSuccess:Query = queries.responses.savePeople
  const peopleEditSuccess:Query = queries.responses.editPeople

  const actions:Query = queries.actions
  const addPeople:Stream<Array<{}> | {}> = Stream.merge(sample(newPeople, peopleSaveSuccess), loadedPeople)

  return { actions, requests: queries.requests, addPeople, peopleEditSuccess }
}
