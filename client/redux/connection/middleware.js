import { ipcRenderer } from 'electron'

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
  'SCANNING_FOLDER'
]

function rescanLibrary (forced = false) {
  ipcRenderer.send('RESCAN_LIBRARY', { forced })
}

const middleware = store => {
  addListeners(eventNames, store)

  ipcRenderer.send('APP_READY', 'Ready to receive')

  setInterval(() => {
    rescanLibrary(false)
  }, 1000 * 60 * 60)

  // rescanLibrary(false)

  return next => action => {
    if (!['SET_CURRENT_TIME', 'SCANNING_FOLDER'].includes(action.type)) {
      console.log(action.type, action.payload)
    }

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

    next(action)
  }
}

export default middleware
