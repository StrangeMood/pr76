import { createSelector } from 'reselect'
import { pathOr, values } from 'ramda'

export const projectFeaturesSelector = createSelector(
  pathOr({}, ['project', 'project', 'features']),
  hash => ({ type: 'FeatureCollection', features: values(hash) })
)

