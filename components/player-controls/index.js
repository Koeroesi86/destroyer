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
  openEqualizer: () => dispatch({ type: 'OPEN_EQUALIZER', payload: {} }),
  setVolume: (volume) => dispatch({ type: 'SET_VOLUME', payload: { volume } })
})

export default window
  ? connect(mapState, mapDispatch)(PlayerControls)
  : PlayerControls
