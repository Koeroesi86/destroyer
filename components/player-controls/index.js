import connect from 'react-redux/es/connect/connect'
import PlayerControls from './PlayerControls'

const mapState = (state) => ({
  volume: state.uiState.volume,
  currentTime: state.uiState.currentTime,
  currentSong: state.uiState.currentSong
})

const mapDispatch = (dispatch) => ({
  setCurrentTime: (currentTime) => dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime } }),
  openEqualizer: () => dispatch({ type: 'OPEN_EQUALIZER', payload: {} }),
  setVolume: (volume) => dispatch({ type: 'SET_VOLUME', payload: { volume } })
})

const ConnectedPlayerControls = connect(
  mapState,
  mapDispatch
)(PlayerControls)

ConnectedPlayerControls.propTypes = Object.assign({}, PlayerControls.propTypes)

export default ConnectedPlayerControls
