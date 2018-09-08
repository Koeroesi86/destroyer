const initialState = {
  view: 'albums',
  port: window.location.search.match(/^\?port=([0-9]+)/)[1],
  onlineView: 'shoutcast',
  tab: 'local',
  nowPlaying: [],
  played: [],
  currentSong: null,
  currentTime: 0,
  volume: 0.5,
  selectedAlbum: null,
  showEqualizer: false,
  scanningFolder: null,
  progress: 0,
  totalCount: 0,
  maximized: false,
  isPlaying: false,
  shuffle: false,
  repeat: false,
  equalizer: [
    -40,
    -40,
    -40,
    -40,
    -40,
    -40,
    -40,
    -40,
    -40,
    -40,
    -40,
    -40
  ]
}

const reducer = (state = initialState, action) => {
  if (action.type === 'SET_VIEW') {
    return Object.assign({}, state, { view: action.payload.view })
  }

  if (action.type === 'SET_ONLINE_VIEW') {
    return Object.assign({}, state, { onlineView: action.payload.view })
  }

  if (action.type === 'PLAY_TRACKS') {
    const { tracks } = action.payload
    return Object.assign({}, state, {
      nowPlaying: tracks,
      played: []
    })
  }

  if (action.type === 'PLAY_TRACK') {
    return Object.assign({}, state, {
      currentSong: action.payload.track || null,
      isPlaying: true
    })
  }

  if (action.type === 'SET_VOLUME') {
    return Object.assign({}, state, {
      volume: parseFloat(action.payload.volume || 0)
    })
  }

  if (action.type === 'SET_CURRENT_TIME') {
    const currentTime = parseFloat(action.payload.currentTime || 0)
    if (currentTime === state.currentTime) return state

    return Object.assign({}, state, {
      currentTime
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

  if (action.type === 'SET_GAIN') {
    const { value, index } = action.payload
    const equalizer = state.equalizer.slice()
    equalizer[index].value = parseFloat(value) / 100.0
    return Object.assign({}, state, {
      equalizer
    })
  }

  if (action.type === 'CLOSE_EQUALIZER') {
    return Object.assign({}, state, {
      showEqualizer: false
    })
  }

  if (action.type === 'SCANNING_FOLDER') {
    const { folder } = action.payload
    return Object.assign({}, state, {
      scanningFolder: folder
    })
  }

  if (action.type === 'SCANNING_FILE') {
    const { progress, totalCount } = action.payload
    return Object.assign({}, state, {
      progress,
      totalCount
    })
  }

  if (action.type === 'STORE_LIBRARY') {
    return Object.assign({}, state, {
      scanningFolder: null
    })
  }

  if (action.type === 'MAXIMIZED_APP') {
    return Object.assign({}, state, {
      maximized: action.payload.maximized
    })
  }

  if (action.type === 'SET_TAB') {
    return Object.assign({}, state, {
      tab: action.payload.tab
    })
  }

  if (action.type === 'SET_PLAYING') {
    return Object.assign({}, state, {
      isPlaying: action.payload.isPlaying
    })
  }

  if (action.type === 'TOGGLE_REPEAT') {
    return Object.assign({}, state, {
      repeat: !state.repeat
    })
  }

  if (action.type === 'TOGGLE_SHUFFLE') {
    return Object.assign({}, state, {
      shuffle: !state.shuffle
    })
  }

  if (action.type === 'CLEAR_PLAYED') {
    return Object.assign({}, state, {
      played: []
    })
  }

  if (action.type === 'ADD_PLAYED') {
    const played = state.played.slice()
    played.push(action.payload.track)
    return Object.assign({}, state, {
      played
    })
  }

  if (action.type === 'RESTORE_SETTINGS') {
    return Object.assign({}, state, action.payload.settings)
  }

  return state
}

export default reducer
