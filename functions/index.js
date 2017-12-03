const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.drillersSlogan = functions.https.onRequest((request, response) => {
//   response.send('Drillers gonna DRILL!!!')
// })
//
// exports.cleanupOrphanedProjects = functions.database.ref('/projects/{id}/collaborators').onWrite((event) => {
//   if (!event.data.exists()) {
//     return event.data.ref.parent.set(null)
//   }
//   return null
// })
//
// exports.updateUserProjectsNames = functions.database.ref('/projects/{id}/name').onUpdate((event) => {
//   const newName = event.data.val()
//   const projectId = event.params.id
//
//   return event.data.ref.parent.child('collaborators').once('value', (snapshot) => {
//     snapshot.forEach(({ key: userId }) =>
//       admin.database().ref(`/users/projects/${userId}/${projectId}/name`).set(newName))
//   })
// })
