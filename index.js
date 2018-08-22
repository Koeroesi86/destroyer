const { app, ipcMain } = require('electron')
const createWindow = require('./electron/createWindow')
const createDatabase = require('./electron/createDatabase')
const setupListeners = require('./electron/setupListeners')

process.env.ELECTRON_ENABLE_LOGGING = '1'

const argv = require('minimist')(process.argv.slice(2))

let mainWindow
let library

let windowLocation = `file://${__dirname}/bundle/index.html`

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

createDatabase()
  .then(({ database, libraryLocation }) => {
    console.log(`Connected to library ${libraryLocation}`)
    library = database

    initWindow()
    setupListeners(library)

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
})
