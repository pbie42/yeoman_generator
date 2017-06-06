import { log, sample, assign } from '../utils'


export default function model(actions, queries) {
  const states = actions.fold((state, action) => action(state), init())

  const submit = actions.filter(action => action.name === 'submitFn')
  const newSubmit = sample(states, submit)

  return { states, newSubmit }
}

export const init = () => ({ name: '', email: '', password: '',  })

export const clear = () => init()

export const submitFn = (state) => state

export const nameChange = (name, state) => assign(state, { name })

export const emailChange = (email, state) => assign(state, { email })

export const passwordChange = (password, state) => assign(state, { password })
