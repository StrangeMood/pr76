import createAction from '../common/create_actions'

const provider = new firebase.auth.GoogleAuthProvider()
const auth = firebase.auth()

export const setCurrentUser = createAction('AUTH/SET_CURRENT_USER', user => user)

export const subscribeOnCurrentUserState = () => (dispatch) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(setCurrentUser({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        photoUrl: user.photoURL,
      }))
    } else dispatch(setCurrentUser(null))
  })
}

export const requestLogin = () => async () => {
  try {
    await auth.signInWithPopup(provider)
  } catch (e) { console.log(e) }
}

export const requestLogout = () => async () => {
  try {
    await auth.signOut()
  } catch (e) { console.error(e) }
}
