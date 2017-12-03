import { projectSelector } from '../project/project_selectors'

const db = firebase.database()

export const addPoint = lngLat => async (_, getState) => {
  const project = projectSelector(getState())

  await db.ref(`projects/${project.id}/features`)
    .push({ 'type': 'Feature', 'geometry': { type: 'Point', coordinates: [lngLat.lng, lngLat.lat] } })
}
