const { BrowserWindow, TouchBar } = require('electron')
const windowStateKeeper = require('electron-window-state')

const { TouchBarLabel, TouchBarSpacer } = TouchBar

const artist = new TouchBarLabel({ textColor: '#5c43e8' })
const track = new TouchBarLabel({ textColor: '#555555' })
const time = new TouchBarLabel({ textColor: '#5c43e8' })

const touchBar = new TouchBar([
  artist,
  new TouchBarSpacer({ size: 'small' }),
  track,
  new TouchBarSpacer({ size: 'small' }),
  time
])

const createWindow = (app) => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  })
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: true,
    darkTheme: true,
    show: false,
    webPreferences: {
      backgroundThrottling: false,
      webSecurity: false
    }
  })
  mainWindowState.manage(mainWindow)
  mainWindow.setTouchBar(touchBar)

  app.updateTouchBar = metadata => {
    artist.label = metadata.artist
    track.label = metadata.track
  }

  app.updateTouchBarTime = duration => {
    time.label = duration
  }

  return mainWindow
}

module.exports = createWindow
