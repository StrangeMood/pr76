import { createSelector } from 'reselect'
import { path } from 'ramda'
import { currentUserSelector } from '../auth/auth_selectors'

export const projectSelector = path(['project', 'project'])
export const projectIsLoadingSelector = createSelector(
  projectSelector,
  project => !project || !!project.isLoading
)
export const isGuestProjectSelector = createSelector(
  projectSelector,
  currentUserSelector,
  (project, currentUser) => !project || !currentUser || !project.collaborators || !project.collaborators[currentUser.id]
)
