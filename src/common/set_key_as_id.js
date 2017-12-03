import { forEachObjIndexed } from 'ramda'

export default forEachObjIndexed((value, key) => { value.id = key })
