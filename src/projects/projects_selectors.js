import { createSelector } from 'reselect'
import { path, values, prop, pipe, sortBy, reverse } from 'ramda'

export const projectsSelector = createSelector(
  path(['projects', 'projects']),
  pipe(values, sortBy(prop('touchedAt')), reverse)
)

export const projectsAreFetchingSelector = path(['projects', 'areLoading'])
