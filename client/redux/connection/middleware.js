import { ipcRenderer } from 'electron'
import _ from 'lodash'
import { basename, extname } from 'path'

function addListeners (eventNames, store) {
  eventNames.forEach(eventName => {
    ipcRenderer.on(eventName, (event, payload) => {
      store.dispatch({
        type: eventName,
        payload
      })
    })
  })
}

const eventNames = [
  'STORE_FOLDERS',
  'STORE_LIBRARY',
  'FOLDERS_ADDED_TO_LIBRARY',
  'TRACKS_ADDED_TO_LIBRARY',
  'LIBRARY_SIZE',
  'MAXIMIZED_APP',
  'CLICKED_URL',
  'SET_PLAYING',
  'RESTORE_SETTINGS',
  'SCANNING_FILE',
  'SCANNING_FOLDER'
]

function rescanLibrary (forced = false) {
  ipcRenderer.send('RESCAN_LIBRARY', { forced })
}

const appLoaded = _.debounce(() => {
  ipcRenderer.send('APP_LOADED', {})
}, 1000)

const middleware = store => {
  if (window) {
    addListeners(eventNames, store)
    ipcRenderer.send('APP_READY', 'Ready to receive')

    setInterval(() => {
      if (store.getState().uiState.scanningFolder.totalCount === 0) {
        rescanLibrary(false)
      }
    }, 1000 * 60 * 60)

    // rescanLibrary(false)
  }

  return next => action => {
    // if (!['SET_CURRENT_TIME', 'SCANNING_FOLDER', 'SCANNING_FILE'].includes(action.type)) {
    //   console.log(action.type, action.payload)
    // }

    if (action.type === 'FILES_ADDED') {
      /** @var {FileList} fileList */
      const { fileList } = action.payload

      const files = []
      Array.prototype.forEach.call(fileList, file => {
        files.push({
          name: file.name,
          path: file.path,
          lastModified: file.lastModified
        })
      })

      ipcRenderer.send('ADD_FOLDERS_TO_LIBRARY', files)
    }

    if (action.type === 'RESCAN_LIBRARY') {
      rescanLibrary(true)
    }

    if (action.type === 'STORE_LIBRARY') {
      appLoaded()
    }

    if (action.type === 'CLOSE_APP') {
      store.dispatch({ type: 'SAVE_SETTINGS', payload: {} })
      ipcRenderer.send('CLOSE_APP', {})
    }

    if (action.type === 'MINIMIZE_APP') {
      ipcRenderer.send('MINIMIZE_APP', {})
    }

    if (action.type === 'MAXIMIZE_APP') {
      ipcRenderer.send('MAXIMIZE_APP', {})
    }

    if (action.type === 'CLICKED_URL') {
      const tracks = action.payload.playlist.map(item => ({
        path: item.file,
        title: item.title,
        duration: 0
      }))
      store.dispatch({ type: 'PLAY_TRACKS', payload: { tracks } })
    }

    if (action.type === 'PLAY_TRACK') {
      const { track } = action.payload
      if (track) {
        const notification = {
          title: track.title,
          body: `${track.artist}\n${track.album}`,
          silent: false,
          sound: false
        }
        if (track.picture) {
          const { port } = store.getState().uiState
          const cover = `${basename(track.picture, extname(track.picture))}-optimized.png`
          const url = `http://localhost:${port}/albumart/${cover}`
          notification.icon = url
          notification.image = url
        }
        const myNotification = new window.Notification(notification.title, notification)
        myNotification.onclick = () => {
          store.dispatch({ type: 'CLICK_NOTIFICATION', payload: {} })
          ipcRenderer.send('NOTIFICATION_CLICKED', { track: action.payload.track })
        }
      }
    }

    if (action.type === 'SAVE_SETTINGS') {
      const {
        view,
        onlineView,
        tab,
        nowPlaying,
        played,
        currentSong,
        currentTime,
        volume,
        selectedAlbum,
        maximized,
        shuffle,
        repeat,
        equalizer
      } = store.getState().uiState

      ipcRenderer.send('SAVE_SETTINGS', {
        view,
        onlineView,
        tab,
        nowPlaying,
        played,
        currentSong,
        currentTime,
        volume,
        selectedAlbum,
        maximized,
        shuffle,
        repeat,
        equalizer
      })
    }

    next(action)
  }
}

export default middleware
