const scanFolder = require('./scanFolder')
const addTrack = require('./addTrack')

/** Scan provided folders for tracks
 * @param database
 * @param {Array} folders
 * @return {Promise<Array>|Promise<Error>}
 */
function scanFolders (database, folders, sender) {
  let tracks = []
  const addedToLibrary = folders.map(folder => {
    return scanFolder(database, folder.path, sender)
  })

  return Promise.all(addedToLibrary)
    .then(() => {
      return Promise.resolve(tracks)
    })
}

module.exports = scanFolders
