import connect from 'react-redux/es/connect/connect'
import PlayerHome from './PlayerHome.jsx'

const mapState = state => ({
  loaded: state.library.loaded,
  tracks: state.library.tracks,
  volume: state.uiState.volume,
  maximized: state.uiState.maximized,
  view: state.uiState.view,
  tab: state.uiState.tab,
  currentSong: state.uiState.currentSong,
  currentTime: state.uiState.currentTime,
  nowPlaying: state.uiState.nowPlaying,
  folders: state.folders,
  scanningFolder: state.uiState.scanningFolder
})
const mapDispatch = dispatch => ({
  /** @param {FileList} fileList */
  addFiles: (fileList) => dispatch({ type: 'FILES_ADDED', payload: { fileList } }),
  setTab: (tab) => dispatch({ type: 'SET_TAB', payload: { tab } }),
  setVolume: (volume) => dispatch({ type: 'SET_VOLUME', payload: { volume } }),
  setCurrentTime: (currentTime) => dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime } }),
  openEqualizer: () => dispatch({ type: 'OPEN_EQUALIZER', payload: {} }),
  playTrack: (track) => dispatch({ type: 'PLAY_TRACK', payload: { track } }),
  trackEnded: () => dispatch({ type: 'TRACK_ENDED', payload: {} }),
  rescanLibrary: () => dispatch({ type: 'RESCAN_LIBRARY', payload: {} })
})

export default window
  ? connect(mapState, mapDispatch)(PlayerHome)
  : PlayerHome
