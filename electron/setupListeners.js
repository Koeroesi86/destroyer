const { ipcMain } = require('electron')
const fs = require('fs')
const executeQuery = require('./executeQuery')
const executeQueries = require('./executeQueries')
const scanFolders = require('./scanFolders')
const addTrack = require('./addTrack')

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
    const queries = files.map(file => ({
      query: `INSERT OR REPLACE INTO folders (path, lastModified) VALUES (?, ?)`,
      variables: [file.path, file.lastModified]
    }))

    executeQueries(database, queries)
      .then(() => {
        event.sender.send('FOLDERS_ADDED_TO_LIBRARY', { folders })

        let tracks = []
        scanFolders(database, folders)
          .then(() => {
            event.sender.send('TRACKS_ADDED_TO_LIBRARY', { tracks })
            ipcMain.send('RESCAN_LIBRARY', 'Do it please')
          })
      })
      .catch(e => console.error(e))
  })

  ipcMain.on('RESCAN_LIBRARY', (event) => {
    console.log('Scanning library...')
    executeQuery(database, {
      query: `SELECT * FROM folders ORDER BY path ASC`,
      variables: []
    })
      .then(folders => Promise.resolve(
        folders.filter(folder =>
          folder.lastModified < Math.floor(fs.statSync(folder.path).mtimeMs))
        )
      )
      .then(folders => scanFolders(database, folders))
      .then(tracks => {
        console.log(`Updating ${tracks.length} track metadata`)
        return Promise.all(
          tracks.map(track => addTrack(database, track))
        )
      })
      .then(() => executeQuery(database, {
        query: `SELECT * FROM library ORDER BY path ASC`,
        variables: []
      }))
      .then(tracks => {
        const queries = tracks
          .filter(track => !fs.existsSync(track.path))
          .map(track => {
            console.log(`Removing non existent ${track.path}`)
            return executeQuery(database, {
              query: `DELETE FROM library WHERE path = ?`,
              variables: [track.path]
            })
          })

        console.log(`Removing ${queries.length} of ${tracks.length} songs`)

        return Promise.all(queries)
      })
      .then(() => executeQuery(database, {
        query: `SELECT * FROM library ORDER BY path ASC`,
        variables: []
      }))
      .then(library => {
        console.log(`Sending library of ${library.length} songs`)
        event.sender.send('STORE_LIBRARY', { library })
      })
  })
}

module.exports = setupListeners
