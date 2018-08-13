const { ipcMain } = require('electron')
const fs = require('fs')
const executeQuery = require('./executeQuery')
const executeQueries = require('./executeQueries')

function setupListeners (database) {
  ipcMain.on('APP_READY', (event) => {
    executeQuery(database, `SELECT * FROM folders ORDER BY path ASC`)
      .then(folders => {
        event.sender.send('STORE_FOLDERS', { folders })
      })

    executeQuery(database, `SELECT * FROM library ORDER BY path ASC`)
      .then(library => {
        event.sender.send('STORE_LIBRARY', { library })
      })
  })

  /** @param {Array} files */
  ipcMain.on('ADD_FOLDERS_TO_LIBRARY', (event, files) => {
    const folders = files.map(file => {
      const stats = fs.statSync(file.path)
      if (stats.isDirectory()) {
        return file
      } else {
        return false
      }
    }).filter(a => a)
    const queries = files.map(file => `INSERT OR REPLACE INTO folders (path, lastModified) VALUES ('${file.path}', ${file.lastModified})`)

    executeQueries(database, queries)
      .then(() => {
        event.sender.send('FOLDERS_ADDED_TO_LIBRARY', { folders })
      })
  })
}

module.exports = setupListeners
