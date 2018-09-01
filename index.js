const { app } = require('electron')
const electronVibrancy = require('electron-vibrancy')
const { resolve } = require('path')
const fs = require('fs')
const fp = require('find-free-port')
const ws = require('windows-shortcuts-appid')
const package = require('./package')
const createWindow = require('./electron/createWindow')
const getLoadingWindow = require('./electron/getLoadingWindow')
const createDatabase = require('./electron/createDatabase')
const setupListeners = require('./electron/setupListeners')
const setupServer = require('./electron/setupServer')

process.env.ELECTRON_ENABLE_LOGGING = '1'

const isWin = process.platform === 'win32'

const argv = require('minimist')(process.argv.slice(2))

let mainWindow
let library
const windows = {
  main: null,
  loading: null
}

let windowLocation
let loadingLocation
let port

if (argv.webpackPort) {
  windowLocation = `http://localhost:${argv.webpackPort}/index.html`
  loadingLocation = `http://localhost:${argv.webpackPort}/loading.html`
}

function setAppId() {
  global.appId = package.build.appId

  if (isWin) {
    app.setAppUserModelId(global.appId)
    console.log('Registered app ID', global.appId)

    const shortcutPath = process.env.APPDATA + '\\Microsoft\\Windows\\Start Menu\\Programs\\' + app.getName() + '.lnk'
    if (!fs.existsSync(shortcutPath)) {
      // Create the shortcut
      ws.create(shortcutPath, process.execPath, err => {
        if(err) throw err

        // Add the app ID to the shortcut
        ws.addAppId(shortcutPath, appId, err => {
          if(err) throw err
          // Ready!
        })
      })
    }
  }
}


const initWindow = () => {
  setAppId()
  windows.main = createWindow(app, windowLocation)
  windows.main.loadURL(windowLocation)

  windows.main.on('closed', () => {
    windows.main = null
    windows.loading = null
  })
}

global.appDataPath = resolve(app.getPath('appData'), `./${package.name}`)

if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath)
}

const libraryLocation = resolve(appDataPath, './library.sqlite')

const getPort = () => {
    return fp(3000, '127.0.0.1')
      .then(freePorts => {
        global.port = freePorts[0]
        if (!windowLocation || !loadingLocation) {
          windowLocation = `http://localhost:${global.port}/app/index.html?port=${global.port}`
          loadingLocation = `http://localhost:${global.port}/app/loading.html`
        } else {
          windowLocation += `?port=${global.port}`
        }

        setupServer()

        return Promise.resolve()
      })
}

getPort()
  .then(() => createDatabase(libraryLocation))
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
