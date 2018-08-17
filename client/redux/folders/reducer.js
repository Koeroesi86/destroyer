const reducer = (state = [], action) => {
  if (action.type === 'STORE_FOLDERS') {
    console.log('received folders', action.payload.folders)
    return action.payload.folders
  }

  return state
}

export default reducer
