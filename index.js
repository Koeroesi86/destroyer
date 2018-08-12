const { app, ipcMain } = require('electron')
const { resolve } = require('path')
const createWindow = require('./electron/createWindow')
const createDatabase = require('./electron/createDatabase')
const executeQuery = require('./electron/executeQuery')

process.env.ELECTRON_ENABLE_LOGGING = '1'

const argv = require('minimist')(process.argv.slice(2))

let mainWindow
let library

const libraryLocation = resolve(__dirname, './database/library.sqlite')

let windowLocation = `file://${__dirname}/components/app/index.html`

if (argv.webpackPort) {
  windowLocation = `http://localhost:${argv.webpackPort}/index.html`
}

const initWindow = () => {
  mainWindow = createWindow(app, windowLocation)
  mainWindow.loadURL(windowLocation)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

createDatabase(libraryLocation)
  .then(db => {
    console.log(`Connected to library ${libraryLocation}`)
    library = db

    initWindow()

    app.on('ready', initWindow)

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (mainWindow === null) {
        initWindow()
      }
    })
  })
  .catch(msg => {
    console.error(msg)
    process.exit(1)
  })

ipcMain.on('APP_READY', () => {
  mainWindow.openDevTools()

  executeQuery(library, `SELECT * FROM folders ORDER BY path ASC`)
    .then(folders => {
      mainWindow && mainWindow.webContents.send('store-folders', { folders })
    })

  executeQuery(library, `SELECT * FROM library ORDER BY path ASC`)
    .then(library => {
      mainWindow && mainWindow.webContents.send('store-library', { library })
    })
})
