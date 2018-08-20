const { ipcMain } = require('electron')
const fs = require('fs')
const executeQuery = require('./executeQuery')
const executeQueries = require('./executeQueries')
const scanFolders = require('./scanFolders')
const addTrack = require('./addTrack')
const rescanLibrary = require('./rescanLibrary')

function setupListeners (database) {
  ipcMain.on('APP_READY', (event) => {
    executeQuery(database, {
      query: `SELECT * FROM folders ORDER BY path ASC`,
      variables: []
    }).then(folders => {
      event.sender.send('STORE_FOLDERS', { folders })
    })

    executeQuery(database, {
      query: `SELECT * FROM library ORDER BY path ASC`,
      variables: []
    }).then(library => {
      event.sender.send('STORE_LIBRARY', { library })
    })
  })

  /** @param {Array} files */
  ipcMain.on('ADD_FOLDERS_TO_LIBRARY', (event, files) => {
    const folders = files.filter(file => fs.statSync(file.path).isDirectory())
    const toRemoveQueries = files.map(file => ({
      query: `SELECT * FROM folders WHERE path LIKE ?`,
      variables: [file.path + '%']
    }))
    executeQueries(database, toRemoveQueries)
      .then(results => {
        if (!results.length) return Promise.resolve()
        const removeQueries = results[0].map(result => ({
          query: `DELETE FROM folders WHERE path = ?`,
          variables: [result.path]
        }))

        return executeQueries(database, removeQueries)
      })
      .then(() => {
        const queries = files.map(file => ({
          query: `INSERT OR REPLACE INTO folders (path, lastModified) VALUES (?, ?)`,
          variables: [file.path, file.lastModified]
        }))

        return executeQueries(database, queries)
      })
      .then(() => {
        event.sender.send('FOLDERS_ADDED_TO_LIBRARY', { folders })

        let tracks = []
        scanFolders(database, folders, event.sender)
          .then(() => {
            event.sender.send('TRACKS_ADDED_TO_LIBRARY', { tracks })
            rescanLibrary(database, event.sender, false)
          })
      })
      .catch(e => console.error(e))
  })

  ipcMain.on('RESCAN_LIBRARY', (event, { forced }) => {
    rescanLibrary(database, event.sender, forced)
  })
}

module.exports = setupListeners
