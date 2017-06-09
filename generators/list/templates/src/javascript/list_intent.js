import xs from 'xstream'
import delay from 'xstream/extra/delay'

import { log, sample, bind } from '../../utils'

import { Repo } from "../repo"

export function intent({ DOM, HTTP }, removeProxy) {

  const queries = Repo.setup(
    Repo.get("/getPhones", "getPhones").now(),
    Repo.post("/removePhones", "removePhones").on(removeProxy)
  )(HTTP)

  const loadedPhones = queries.responses.getPhones.map(phones => xs.of(...phones)).flatten()
  const phonesRemoveSuccess = queries.responses.removePhones

  const actions = queries.actions
  const addPhones = xs.merge(loadedPhones)

  return { actions, requests: queries.requests, addPhones, phonesRemoveSuccess }
}
