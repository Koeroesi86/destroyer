import { ipcRenderer } from 'electron'
const middleware = store => {
  ipcRenderer.on('store-folders', (event, folders) => {
    store.dispatch({
      type: 'RECEIVE_FOLDERS',
      payload: { folders }
    })
  })

  ipcRenderer.on('store-library', (event, library) => {
    store.dispatch({
      type: 'RECEIVE_LIBRARY',
      payload: { library }
    })
  })

  ipcRenderer.send('APP_READY', 'Ready to receive')

  return next => action => {
    console.log(action)

    next(action)
  }
}

export default middleware
