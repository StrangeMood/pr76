import rndstr from 'randomatic'
import createAction from '../common/create_actions'
import { currentUserSelector } from '../auth/auth_selectors'
import { touchUserProject } from '../projects/projects_actions'

const db = firebase.database()

export const setProject = createAction('PROJECT/SET', project => project)

const cancelProjectSubscriptions = {}

export const subscribeProject = project => (dispatch) => {
  if (cancelProjectSubscriptions[project.id]) return null

  const projectRef = db.ref(`projects/${project.id}`)
  const subscription = projectRef.on('value', (snapshot) => {
    dispatch(setProject(snapshot.val()))
    dispatch(touchUserProject(project))
  })

  cancelProjectSubscriptions[project.id] = () => {
    projectRef.off('value', subscription)
    cancelProjectSubscriptions[project.id] = null
  }
}

export const unsubscribeProject = project => () => {
  if (cancelProjectSubscriptions[project.id]) cancelProjectSubscriptions[project.id]()
}

const presenceKey = rndstr('Aa0', 20)
export const setProjectPresence = (project, isOnline) => (dispatch, getState) => {
  const currentUser = currentUserSelector(getState())

  const presenceRef = db.ref(`projects/${project.id}/collaborators/${currentUser.id}/online/${presenceKey}`)
  presenceRef.set(isOnline ? true : null)
  if (isOnline) presenceRef.onDisconnect().set(null)
}
