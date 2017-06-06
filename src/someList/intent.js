import xs from 'xstream'
import delay from 'xstream/extra/delay'

import { log, sample, bind } from '../utils'

import { Repo } from "../repo"

export function intent({ DOM, HTTP, newPeople, editPeople }) {

  const queries = Repo.setup(
    Repo.get("/getPeople", "getPeople").now(),
    Repo.post("/savePeople", "savePeople").on(newPeople),
    Repo.post('/editPeople', 'editPeople').on(editPeople),
  )(HTTP)

  const loadedPeople = queries.responses.getPeople.map(people => xs.of(...people)).flatten()
  const peopleSaveSuccess = queries.responses.savePeople
  const peopleEditSuccess = queries.responses.editPeople

  const actions = queries.actions
  const addPeople = xs.merge(sample(newPeople, peopleSaveSuccess), loadedPeople)

  return { actions, requests: queries.requests, addPeople, peopleEditSuccess }
}
