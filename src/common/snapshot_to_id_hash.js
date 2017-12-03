export default function snapshotToIdHash(snapshot) {
  const hash = {}
  snapshot.forEach((doc) => {
    hash[doc.key] = doc.val()
  })
  return hash
}
