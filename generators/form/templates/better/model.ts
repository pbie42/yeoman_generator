import { Stream } from 'xstream'
import { log, sample, assign } from '../../utils'

import { State, Model } from './interfaces'

export default function model(actions: Stream<Function>):Model {

  const states:Stream<State> = actions.fold((state, action) => action(state), init())

  const submit:Stream<Function> = actions.filter(action => action.name === 'submitFn')
  const newSubmit:Stream<State> = sample(states, submit)

  return { states, newSubmit }
}


export const init = ():State => ({ name: '', email: '', password: '',  })

export const clear = ():State => init()

export const submitFn = (state:State):State => state

export const nameChange = (name:string, state:State):State => assign(state, { name })

export const emailChange = (email:string, state:State):State => assign(state, { email })

export const passwordChange = (password:string, state:State):State => assign(state, { password })



