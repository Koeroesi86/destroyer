const { ipcMain } = require('electron')
const executeQuery = require('./executeQuery')
const executeQueries = require('./executeQueries')

function setupListeners (database, mainWindow) {
  ipcMain.on('APP_READY', (event) => {
    executeQuery(database, `SELECT * FROM folders ORDER BY path ASC`)
      .then(folders => {
        event.sender.send('STORE_FOLDERS', { folders })
        // mainWindow && mainWindow.webContents.send('STORE_FOLDERS', { folders })
      })

    executeQuery(database, `SELECT * FROM library ORDER BY path ASC`)
      .then(library => {
        event.sender.send('STORE_LIBRARY', { library })
        // mainWindow && mainWindow.webContents.send('STORE_LIBRARY', { library })
      })
  })

  /** @param {Array} files */
  ipcMain.on('ADD_FOLDERS_TO_LIBRARY', (event, files) => {
    const queries = files.map(file => {
      console.log('file', file)
      return `INSERT OR REPLACE INTO folders (path, lastModified) VALUES ('${file.path}', ${file.lastModified})`
    })

    executeQueries(database, queries)
      .then(() => {
        event.sender.send('FOLDERS_ADDED_TO_LIBRARY', { count: queries.length })
      })
  })
}

module.exports = setupListeners
