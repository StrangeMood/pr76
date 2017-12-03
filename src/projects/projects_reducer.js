import { handleActions } from 'redux-actions'
import { merge } from 'ramda'
import { setProjects } from './projects_actions'

const DEFAULT_STATE = {
  projects: {},
  areLoading: true,
}

export default handleActions({
  [setProjects]: (state, { payload: projects }) => merge(state, { projects, areLoading: false }),
}, DEFAULT_STATE)
