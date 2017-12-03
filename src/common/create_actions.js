export default function createAction(type, payloadFn) {
  const actionCreator = (...args) => ({ type, payload: payloadFn(...args) })
  actionCreator.toString = () => type
  return actionCreator
}
