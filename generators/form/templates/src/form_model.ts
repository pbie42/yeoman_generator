import { Stream } from 'xstream'
import { log, sample, assign } from './utils'

export interface State {
  name: string,
  email: string,
  password: string
}

export default function model(actions: Stream<Function>) {

  const states:Stream<State> = actions.fold((state, action) => action(state), init())

  const submit:Stream<Function> = actions.filter(action => action.name === 'submitFn')
  const newSubmit:Stream<State> = sample(states, submit)

  return { states, newSubmit }
}

export const init = () => ({ name: '', email: '', password: '',  })

export const clear = () => init()

export const submitFn = (state) => state

export const nameChange = (name, state) => assign(state, { name })

export const emailChange = (email, state) => assign(state, { email })

export const passwordChange = (password, state) => assign(state, { password })
