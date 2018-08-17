const reducer = (state = [], action) => {
  if (action.type === 'STORE_LIBRARY') {
    console.log('received library', action.payload.library)
    return action.payload.library
  }

  return state
}

export default reducer
