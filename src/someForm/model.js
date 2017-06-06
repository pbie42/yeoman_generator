import { log, sample, assign } from '../utils'


export default function model(actions) {
  const states = actions.fold((state, action) => action(state), init())

  const submit = actions.filter(action => action.name === 'submitFn')
  const newUsers = sample(states, submit)

  const editSubmit = actions.filter(action => action.name === 'editFn')
  const editUsers = sample(states, editSubmit)

  return { states, newUsers, editUsers }
}

export const init = () => ({ name: '', email: '', location: '',  })

export const clear = () => init()

export const edit = (data, state) =>
      assign(state, { name: data.name, email: data.email, location: data.location, id: data.id })

export const submitFn = (state) => state

export const editFn = (state) => state

export const nameChange = (name, state) => assign(state, { name })

export const emailChange = (email, state) => assign(state, { email })

export const locationChange = (location, state) => assign(state, { location })

