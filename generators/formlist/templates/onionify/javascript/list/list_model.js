export function model(actions) {
  const states = actions.fold((state, action) => action(state), { requests: {} })
  return { states }
}
