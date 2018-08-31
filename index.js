const { app, protocol } = require('electron')
// const electronAcrylic = require('electron-acrylic')
const electronVibrancy = require('electron-vibrancy')
const { resolve, normalize, parse } = require('path')
const fs = require('fs')
const mmmagic = require('mmmagic')
const fp = require('find-free-port')
const express = require('express')
const url = require('url')
const package = require('./package')
const createWindow = require('./electron/createWindow')
const getLoadingWindow = require('./electron/getLoadingWindow')
const createDatabase = require('./electron/createDatabase')
const setupListeners = require('./electron/setupListeners')

const server = express()

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
const magic = new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE)

server.get('/local', (request, response) => {
  const url_parts = url.parse(request.url, true)
  const query = url_parts.query

  if(query.path) {
    magic.detectFile(query.path, function(err, result) {
      if (err) {
        response.status(500).send(err)
        return
      }
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      response.setHeader("content-type", result);
      fs.createReadStream(query.path).pipe(response);
    })
  } else {
    response.status(404)
  }
})

const getPort = () => {
    return fp(3000, '127.0.0.1')
      .then(freePorts => {
        port = freePorts[0]
        if (!windowLocation || !loadingLocation) {
          windowLocation = `http://localhost:${port}/app/index.html?port=${port}`
          loadingLocation = `http://localhost:${port}/app/loading.html`

          server.use('/app', express.static('public'))
        } else {
          windowLocation += `?port=${port}`
        }
        server.listen(port, () => {
          console.log(`Example app listening on port ${port}!`)
          console.log(`App starts on ${windowLocation}`)
        })
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
