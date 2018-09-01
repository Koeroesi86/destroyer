import connect from 'react-redux/es/connect/connect'
import PlayerControls from './PlayerControls'

const mapState = (state) => ({
  port: state.uiState.port,
  volume: state.uiState.volume,
  currentTime: state.uiState.currentTime,
  currentSong: state.uiState.currentSong
})

const mapDispatch = (dispatch) => ({
  setCurrentTime: (currentTime) => dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime } }),
  openEqualizer: () => dispatch({ type: 'SET_TAB', payload: { tab: 'equalizer' } }),
  setVolume: (volume) => dispatch({ type: 'SET_VOLUME', payload: { volume } })
})

export default window
  ? connect(mapState, mapDispatch)(PlayerControls)
  : PlayerControls
