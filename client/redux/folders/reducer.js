const reducer = (state = [], action) => {
  if (action.type === 'STORE_FOLDERS') {
    return action.payload.folders
  }

  return state
}

export default reducer
