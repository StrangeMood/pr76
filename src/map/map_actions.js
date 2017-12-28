import rndstr from 'randomatic'
import { projectSelector } from '../project/project_selectors'

const db = firebase.database()

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
