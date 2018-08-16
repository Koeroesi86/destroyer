const { ipcMain } = require('electron')
const fs = require('fs')
const executeQuery = require('./executeQuery')
const executeQueries = require('./executeQueries')
const scanFolder = require('./scanFolder')

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

        const addedToLibrary = folders.map(folder => {
          return new Promise((resolve, reject) => {
            scanFolder(folder.path)
              .then(tracks => {
                // console.log('scanFolder', tracks.length)
                const trackQueries = tracks.map(track => executeQuery(database, {
                  query: `INSERT OR REPLACE INTO library (path, artist, album, title, year, track, disk, genre, picture, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  variables: [
                    track.path,
                    track.artist,
                    track.album,
                    track.title,
                    track.year,
                    track.track,
                    track.disk,
                    track.genre,
                    track.picture,
                    track.duration
                  ]
                }))

                Promise.all(trackQueries)
                  .then(() => resolve(...tracks))
                  .catch(msg => reject(msg))
              })
              .catch(msg => reject(msg))
          })
        })

        Promise.all(addedToLibrary)
          .then((...tracks) => {
            // console.log('tracks', tracks.length)
            // event.sender.send('TRACKS_ADDED_TO_LIBRARY', { tracks })
          })
      })
      .catch(e => console.error(e))
  })
}

module.exports = setupListeners
