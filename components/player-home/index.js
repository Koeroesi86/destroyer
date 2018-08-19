import connect from 'react-redux/es/connect/connect'
import PlayerHome from './PlayerHome.jsx'

const mapState = state => ({
  tracks: state.library.tracks,
  volume: state.uiState.volume,
  view: state.uiState.view,
  currentSong: state.uiState.currentSong,
  currentTime: state.uiState.currentTime,
  nowPlaying: state.uiState.nowPlaying,
  folders: state.folders
})
const mapDispatch = dispatch => ({
  /** @param {FileList} fileList */
  addFiles: (fileList) => dispatch({ type: 'FILES_ADDED', payload: { fileList } }),
  setView: (view) => dispatch({ type: 'SET_VIEW', payload: { view } }),
  setVolume: (volume) => dispatch({ type: 'SET_VOLUME', payload: { volume } }),
  setCurrentTime: (currentTime) => dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime } }),
  openEqualizer: () => dispatch({ type: 'OPEN_EQUALIZER', payload: {} }),
  playTrack: (track) => dispatch({ type: 'PLAY_TRACK', payload: { track } }),
  trackEnded: () => dispatch({ type: 'TRACK_ENDED', payload: {} }),
  rescanLibrary: () => dispatch({ type: 'RESCAN_LIBRARY', payload: {} })
})

const ConnectedPlayerHome = connect(
  mapState,
  mapDispatch
)(PlayerHome)

ConnectedPlayerHome.propTypes = Object.assign({}, PlayerHome.propTypes)

export default ConnectedPlayerHome
