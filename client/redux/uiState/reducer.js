const initialState = {
  view: 'albums',
  nowPlaying: [],
  currentSong: null,
  currentTime: 0,
  volume: 0.5,
  selectedAlbum: null,
  showEqualizer: false
}

const reducer = (state = initialState, action) => {
  if (action.type === 'SET_VIEW') {
    return Object.assign({}, state, { view: action.payload.view })
  }

  if (action.type === 'PLAY_TRACKS') {
    const { tracks } = action.payload
    return Object.assign({}, state, {
      nowPlaying: tracks,
      currentSong: tracks[0] || null
    })
  }

  if (action.type === 'PLAY_TRACK') {
    return Object.assign({}, state, {
      currentSong: action.payload.track || null
    })
  }

  if (action.type === 'SET_VOLUME') {
    return Object.assign({}, state, {
      volume: parseFloat(action.payload.volume || 0)
    })
  }

  if (action.type === 'SET_CURRENT_TIME') {
    return Object.assign({}, state, {
      currentTime: parseFloat(action.payload.currentTime || 0)
    })
  }

  if (action.type === 'TRACK_ENDED') {
    const { nowPlaying, currentSong } = state
    const currentIndex = nowPlaying.indexOf(currentSong)
    let nextSong = null
    // TODO: repeat / shuffle
    if (currentIndex < nowPlaying.length - 1) {
      nextSong = Object.assign({}, nowPlaying[currentIndex + 1])
    }

    return Object.assign({}, state, {
      currentSong: nextSong,
      currentTime: 0
    })
  }

  if (action.type === 'SELECT_ALBUM') {
    return Object.assign({}, state, {
      selectedAlbum: action.payload.album || null,
      showEqualizer: action.payload.album ? false : state.showEqualizer
    })
  }

  if (action.type === 'OPEN_EQUALIZER') {
    return Object.assign({}, state, {
      showEqualizer: true,
      selectedAlbum: null
    })
  }

  if (action.type === 'CLOSE_EQUALIZER') {
    return Object.assign({}, state, {
      showEqualizer: false
    })
  }

  return state
}

export default reducer
