import sampleCombine from 'xstream/extra/sampleCombine'

export const log = (msg) => {
  console.log(msg)
  return msg
}

export const bind = (fn, ...args) => {
  const bound = fn.bind(this, ...args)
  bound._fn = fn
  bound._args = args

  return bound
}

export const sample = (source, trigger) => {
  return trigger.compose(sampleCombine(source)).map(([_, value]) => {
		console.log('value', value)
		console.log('\n')
    return Object.assign({}, value)
  })
}

export const { stringify } = JSON
export const { values, keys, assign } = Object
