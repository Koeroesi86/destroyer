const { app, ipcMain } = require('electron')
const createWindow = require('./electron/createWindow')
const getLoadingWindow = require('./electron/getLoadingWindow')
const createDatabase = require('./electron/createDatabase')
const setupListeners = require('./electron/setupListeners')

process.env.ELECTRON_ENABLE_LOGGING = '1'

const argv = require('minimist')(process.argv.slice(2))

let mainWindow
let library
const windows = {
  main: null,
  loading: null
}

let windowLocation = `file://${__dirname}/bundle/index.html`
let loadingLocation = `file://${__dirname}/bundle/loading.html`

if (argv.webpackPort) {
  windowLocation = `http://localhost:${argv.webpackPort}/index.html`
  loadingLocation = `http://localhost:${argv.webpackPort}/loading.html`
}

const initWindow = () => {
  windows.main = createWindow(app, windowLocation)
  windows.main.loadURL(windowLocation)

  windows.main.on('closed', () => {
    windows.main = null
    windows.loading = null
  })
}

createDatabase()
  .then(({ database, libraryLocation }) => {
    console.log(`Connected to library ${libraryLocation}`)
    library = database

    windows.loading = getLoadingWindow()
    windows.loading.loadURL(loadingLocation)
    windows.loading.once('ready-to-show', () => {
      windows.loading.show()
    })

    initWindow()
    setupListeners(library, windows)

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
