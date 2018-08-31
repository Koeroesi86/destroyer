import AudioComponent from './AudioComponent'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  currentSong: state.uiState.currentSong,
  currentTime: state.uiState.currentTime,
  volume: state.uiState.volume,
  port: state.uiState.port
})

const mapDispatch = dispatch => ({
  trackEnded: () => dispatch({ type: 'TRACK_ENDED', payload: {} }),
  setCurrentTime: (currentTime) => dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime } })
})

export default window
  ? connect(mapState, mapDispatch)(AudioComponent)
  : AudioComponent
