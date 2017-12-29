import { handleActions } from 'redux-actions'
import { assoc } from 'ramda'
import { MAP_BASE_STYLE, setBaseStyle } from './map_actions'

const DEFAULT_STATE = {
  baseStyle: MAP_BASE_STYLE.ROAD,
}

export default handleActions({
  [setBaseStyle]: (state, { payload: style }) => assoc('baseStyle', style, state),
}, DEFAULT_STATE)
