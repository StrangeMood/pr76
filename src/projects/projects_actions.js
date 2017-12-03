import rndstr from 'randomatic'
import { assoc, pick } from 'ramda'

import createAction from '../common/create_actions'
import snapshotToIdHash from '../common/snapshot_to_id_hash'
import { currentUserSelector } from '../auth/auth_selectors'

const db = firebase.database()

export const setProjects = createAction('PROJECTS/SET_PROJECTS', projectsHash => projectsHash)

let cancelProjectsSubscription

export const subscribeProjects = () => (dispatch, getState) => {
  if (cancelProjectsSubscription) return null

  const currentUser = currentUserSelector(getState())
  const projectsRef = db.ref(`users/${currentUser.id}/projects`)

  const subscription = projectsRef.on('value', (snapshot) => {
    dispatch(setProjects(snapshotToIdHash(snapshot)))
  })
  cancelProjectsSubscription = () => {
    projectsRef.off('value', subscription)
    cancelProjectsSubscription = null
  }
}

export const unsubscribeProjects = () => () => {
  if (cancelProjectsSubscription) cancelProjectsSubscription()
}

export const requestJoinProject = project => async (dispatch, getState) => {
  const currentUser = currentUserSelector(getState())

  await Promise.all([
    db.ref(`users/${currentUser.id}/projects/${project.id}`).set({
      ...pick(['id', 'name'], project),
      touchedAt: new Date().getTime(),
    }),
    db.ref(`projects/${project.id}/collaborators/${currentUser.id}`).set(pick(['id', 'name', 'photoUrl'], currentUser)),
  ])
}

export const requestLeaveProject = project => async (dispatch, getState) => {
  const currentUser = currentUserSelector(getState())

  await Promise.all([
    db.ref(`projects/${project.id}/collaborators/${currentUser.id}`).set(null),
    db.ref(`users/${currentUser.id}/projects/${project.id}`).set(null),
  ])
}

export const requestCreateProject = (attrs = { name: 'UNNAMED' }) => async (dispatch) => {
  const id = rndstr('Aa0', 20)
  const project = assoc('id', id, attrs)

  await Promise.all([
    db.ref(`projects/${id}`).set(project),
    dispatch(requestJoinProject(project)),
  ])
}

export const touchUserProject = project => async (dispatch, getState) => {
  const currentUser = currentUserSelector(getState())
  if (currentUser) {
    await db.ref(`users/${currentUser.id}/projects/${project.id}/touchedAt`).set(new Date().getTime())
  }
}
