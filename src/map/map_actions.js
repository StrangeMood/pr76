import rndstr from 'randomatic'
import createAction from '../common/create_actions'
import { projectSelector } from '../project/project_selectors'

const db = firebase.database()

export const MAP_BASE_STYLE = {
  ROAD: 'ROAD',
  SATELLITE: 'SATELLITE',
}

export const setBaseStyle = createAction('MAP/SET_BASE_STYLE', baseStyle => baseStyle)

export const addPoint = lngLat => async (_, getState) => {
  const project = projectSelector(getState())

  const id = rndstr('Aa0', 20)
  const point = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lngLat.lng, lngLat.lat] },
    properties: { id },
  }
  await db.ref(`projects/${project.id}/features/${id}`).set(point)
}
