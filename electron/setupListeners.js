const { ipcMain } = require('electron')
const fs = require('fs')
const executeQuery = require('./executeQuery')
const executeQueries = require('./executeQueries')
const scanFolders = require('./scanFolders')
const addTrack = require('./addTrack')
const rescanLibrary = require('./rescanLibrary')

function memorySizeOf (obj) {
  let bytes = 0

  function sizeOf (obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8
          break
        case 'string':
          bytes += obj.length * 2
          break
        case 'boolean':
          bytes += 4
          break
        case 'object':
          const objClass = Object.prototype.toString.call(obj).slice(8, -1)
          if (objClass === 'Object' || objClass === 'Array') {
            for (let key in obj) {
              if (!obj.hasOwnProperty(key)) continue
              sizeOf(obj[key])
            }
          } else bytes += obj.toString().length * 2
          break
      }
    }
    return bytes
  };

  function formatByteSize (bytes) {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KiB'
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MiB'
    else return (bytes / 1073741824).toFixed(3) + ' GiB'
  }

  return formatByteSize(sizeOf(obj))
}

function setupListeners (database) {
  ipcMain.on('APP_READY', (event) => {
    executeQuery(database, {
      query: `SELECT * FROM folders ORDER BY path ASC`,
      variables: []
    }).then(folders => {
      event.sender.send('STORE_FOLDERS', { folders })
    }).catch(e => console.error(e))

    executeQuery(database, {
      query: `SELECT * FROM library ORDER BY path ASC`,
      variables: []
    }).then(library => {
      console.log('library size', memorySizeOf({ library }))
      if (library.length <= 200) {
        event.sender.send('STORE_LIBRARY', { library })
      } else {
        let chunks = []
        let from = 0
        library.forEach((track, index) => {
          if (chunks.length === 200) {
            event.sender.send('STORE_LIBRARY', { library: chunks, to: index, from })
            chunks.splice(0)
            from = index
          }
          chunks.push(track)
        })
        event.sender.send('STORE_LIBRARY', { library: chunks, to: library.length - 1, from })
      }
    }).catch(e => console.error(e))
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
