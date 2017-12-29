import { createSelector } from 'reselect'
import { pathOr, values, path } from 'ramda'

export const mapBaseStyleSelector = path(['map', 'baseStyle'])

export const projectFeaturesSelector = createSelector(
  pathOr({}, ['project', 'project', 'features']),
  hash => ({ type: 'FeatureCollection', features: values(hash) })
)

