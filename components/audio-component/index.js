import AudioComponent from './AudioComponent'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  currentSong: state.uiState.currentSong,
  currentTime: state.uiState.currentTime,
  volume: state.uiState.volume
})

const mapDispatch = dispatch => ({
  trackEnded: () => dispatch({ type: 'TRACK_ENDED', payload: {} }),
  setCurrentTime: (currentTime) => dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime } })
})

const ConnectedAudioComponent = connect(
  mapState,
  mapDispatch
)(AudioComponent)

ConnectedAudioComponent.propTypes = Object.assign({}, AudioComponent.propTypes)

export default ConnectedAudioComponent
