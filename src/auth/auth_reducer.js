import { handleActions } from 'redux-actions'
import { merge } from 'ramda'

import { setCurrentUser } from './auth_actions'

const DEFAULT_STATE = {
  isChecking: true,
  currentUser: null,
}

export default handleActions({
  [setCurrentUser]: (state, { payload: currentUser }) => merge(state, { currentUser, isChecking: false }),
}, DEFAULT_STATE)
