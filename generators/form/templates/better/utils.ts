import { Stream } from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

export function log(...args: any[]) {
	console.log.apply(console, args)
	return args.length === 1 ? args[0] : args
}

export function intValBtn(event:Event):number {
	return parseInt((event.target as HTMLButtonElement).value)
}

export function intValInput(event:Event):number {
	return parseInt((event.target as HTMLInputElement).value)
}

export function intValAnchor(event:Event):number {
	return parseInt((event.target as HTMLAnchorElement).name)
}

export function sample(source, trigger): Stream<Object> {
  return trigger.compose(sampleCombine(source)).map(([_, value]) => {
    return Object.assign({}, value)
  })
}

export const bind = (fn: Function, ...args: any[]) => fn.bind(this, ...args)
export const { values, keys, assign } = Object