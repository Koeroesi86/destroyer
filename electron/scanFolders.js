const scanFolder = require('./scanFolder')
const addTrack = require('./addTrack')

/** Scan provided folders for tracks
 * @param database
 * @param {Array} folders
 * @return {Promise<Array>|Promise<Error>}
 */
function scanFolders (database, folders) {
  let tracks = []
  const addedToLibrary = folders.map(folder => {
    return new Promise((resolve, reject) => {
      scanFolder(folder.path)
        .then(folderTracks => {
          const trackQueries = folderTracks.map(folderTrack => {
            return addTrack(database, folderTrack)
              .then(() => {
                tracks.push(folderTrack)
                return Promise.resolve()
              })
          })

          Promise.all(trackQueries).then(() => resolve())
        })
        .catch(msg => reject(msg))
    })
  })

  return Promise.all(addedToLibrary)
    .then(() => {
      return Promise.resolve(tracks)
    })
}

module.exports = scanFolders
