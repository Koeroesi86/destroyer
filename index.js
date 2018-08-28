const { app } = require('electron')
// const electronAcrylic = require('electron-acrylic')
const electronVibrancy = require('electron-vibrancy')
const { resolve } = require('path')
const fs = require('fs')
const package = require('./package')
const createWindow = require('./electron/createWindow')
const getLoadingWindow = require('./electron/getLoadingWindow')
const createDatabase = require('./electron/createDatabase')
const setupListeners = require('./electron/setupListeners')

process.env.ELECTRON_ENABLE_LOGGING = '1'

const isWin = process.platform === 'win32'

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

const appDataPath = resolve(app.getPath('appData'), `./${package.name}`)

if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath)
}

const libraryLocation = resolve(appDataPath, './library.sqlite')

createDatabase(libraryLocation)
  .then((database) => {
    console.log(`Connected to library ${libraryLocation}`)
    library = database

    windows.loading = getLoadingWindow()
    windows.loading.loadURL(loadingLocation)
    windows.loading.once('ready-to-show', () => {
      windows.loading.show()
      // electronAcrylic.setAcrylic(windows.loading, 0xFFFFFF)
      if (isWin) electronVibrancy.SetVibrancy(windows.loading, 0)
    })

    initWindow()
    setupListeners(library, windows, appDataPath)

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
