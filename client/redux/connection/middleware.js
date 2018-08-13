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

const middleware = store => {
  const eventNames = [
    'STORE_FOLDERS',
    'STORE_LIBRARY',
    'FOLDERS_ADDED_TO_LIBRARY'
  ]

  addListeners(eventNames, store)

  ipcRenderer.send('APP_READY', 'Ready to receive')

  return next => action => {
    console.log(action.type, action.payload)

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

    next(action)
  }
}

export default middleware
