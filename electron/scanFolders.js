const scanFolder = require('./scanFolder')

/** Scan provided folders for tracks
 * @param database
 * @param {Array} folders
 * @param sender
 * @param {String} appDataPath
 * @return {Promise<Array>|Promise<Error>}
 */
function scanFolders (database, folders, sender, appDataPath) {
  const addedToLibrary = folders.map(folder => {
    return scanFolder(database, folder.path, sender, appDataPath)
  })

  return Promise.all(addedToLibrary)
}

module.exports = scanFolders
