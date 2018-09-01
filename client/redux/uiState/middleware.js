const middleware = store => next => action => {
  if (action.type === 'TRACK_ENDED') {
    const { nowPlaying, currentSong } = store.getState().uiState
    const currentIndex = nowPlaying.indexOf(currentSong)
    let nextSong = null
    // TODO: repeat / shuffle
    if (currentIndex < nowPlaying.length - 1) {
      nextSong = Object.assign({}, nowPlaying[currentIndex + 1])
    }

    store.dispatch({ type: 'PLAY_TRACK', payload: { track: nextSong } })
  }

  if (action.type === 'PLAY_TRACKS') {
    const { tracks } = action.payload
    store.dispatch({ type: 'PLAY_TRACK', payload: { track: tracks[0] || null } })
  }

  if (action.type === 'CLICK_NOTIFICATION') {
    store.dispatch({ type: 'SET_TAB', payload: { tab: 'now-playing' } })
  }

  next(action)
}

export default middleware
