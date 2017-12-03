import { handleActions } from 'redux-actions'
import { assoc } from 'ramda'
import { setProject } from './project_actions'

const DEFAULT_STATE = {
  project: null,
}

export default handleActions({
  [setProject]: (state, { payload: project }) => assoc('project', project, state),
}, DEFAULT_STATE)
