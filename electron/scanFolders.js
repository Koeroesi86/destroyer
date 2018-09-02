const scanFolder = require('./scanFolder')

/** Scan provided folders for tracks
 * @param {Array} folders
 * @param sender
 * @return {Promise<Array>|Promise<Error>}
 */
function scanFolders (folders, sender) {
  return folders.reduce((p, folder) => {
    return p.then(() => scanFolder(folder.path, sender))
  }, Promise.resolve())
}

module.exports = scanFolders
