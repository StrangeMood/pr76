import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import history from './history'
import authReducer from './auth/auth_reducer'
import projectsReducer from './projects/projects_reducer'
import projectReducer from './project/project_reducer'

const combinedReducer = combineReducers({
  auth: authReducer,
  projects: projectsReducer,
  project: projectReducer,
})

export default connectRouter(history)(combinedReducer)
