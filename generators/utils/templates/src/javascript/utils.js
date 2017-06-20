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

export function mergeStateLv1(obj1, obj2) {
    const obj3 = {}
    for (let attrname in obj2) { obj3[attrname] = obj2[attrname] }
    for (let attrname in obj1) { obj3[attrname] = obj1[attrname] }
    return obj3
}

export const { stringify } = JSON
export const { values, keys, assign } = Object
