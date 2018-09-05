const shufflePlaylist = (playList = [], played = []) => {
  const filtered = playList
    .slice()
    .filter(track => played.findIndex(t => t.path === track.path) === -1)

  return filtered[Math.floor(Math.random() * filtered.length)]
}

// TODO: simplify
const middleware = store => next => action => {
  if (action.type === 'TRACK_ENDED') {
    store.dispatch({ type: 'NEXT_SONG', payload: {} })
  }

  if (action.type === 'FORCE_PLAY_TRACK') {
    store.dispatch({ type: 'CLEAR_PLAYED', payload: {} })
    store.dispatch({ type: 'PLAY_TRACK', payload: { track: action.payload.track } })
  }

  if (action.type === 'NEXT_SONG') {
    const { nowPlaying, currentSong, repeat, shuffle, played } = store.getState().uiState

    if (!repeat) {
      store.dispatch({ type: 'ADD_PLAYED', payload: { track: currentSong } })
    }

    const currentIndex = nowPlaying.findIndex(track => track.path === currentSong.path)

    if (!shuffle) {
      if (currentIndex < nowPlaying.length - 1) {
        store.dispatch({
          type: 'PLAY_TRACK',
          payload: { track: Object.assign({}, nowPlaying[currentIndex + 1]) }
        })
      } else if (repeat) {
        store.dispatch({
          type: 'PLAY_TRACK',
          payload: { track: Object.assign({}, nowPlaying[0]) }
        })
      }
    } else {
      if (repeat) {
        store.dispatch({
          type: 'PLAY_TRACK',
          payload: { track: shufflePlaylist(nowPlaying, []) }
        })
      } else {
        store.dispatch({
          type: 'PLAY_TRACK',
          payload: { track: shufflePlaylist(nowPlaying, played) }
        })
      }
    }
  }

  if (action.type === 'PREVIOUS_SONG') {
    const { nowPlaying, currentSong, repeat, shuffle, played } = store.getState().uiState
    const currentIndex = nowPlaying.findIndex(track => track.path === currentSong.path)

    if (!shuffle) {
      if (currentIndex > 0) {
        store.dispatch({
          type: 'PLAY_TRACK',
          payload: { track: Object.assign({}, nowPlaying[currentIndex - 1]) }
        })
      } else if (repeat) {
        store.dispatch({
          type: 'PLAY_TRACK',
          payload: { track: Object.assign({}, nowPlaying[nowPlaying.length - 1]) }
        })
      }
    } else {
      if (repeat) {
        store.dispatch({
          type: 'PLAY_TRACK',
          payload: { track: shufflePlaylist(nowPlaying, []) }
        })
      } else {
        store.dispatch({
          type: 'PLAY_TRACK',
          payload: { track: shufflePlaylist(nowPlaying, played) }
        })
      }
    }
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
