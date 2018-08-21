const scanFolder = require('./scanFolder')

/** Scan provided folders for tracks
 * @param database
 * @param {Array} folders
 * @param sender
 * @return {Promise<Array>|Promise<Error>}
 */
function scanFolders (database, folders, sender) {
  const addedToLibrary = folders.map(folder => {
    return scanFolder(database, folder.path, sender)
  })

  return Promise.all(addedToLibrary)
}

module.exports = scanFolders
