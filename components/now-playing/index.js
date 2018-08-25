import connect from 'react-redux/es/connect/connect'
import NowPlaying from './NowPlaying'

const mapState = state => ({
  currentSong: state.uiState.currentSong,
  nowPlaying: state.uiState.nowPlaying
})

const mapDispatch = dispatch => ({
  playTrack: (track) => dispatch({ type: 'PLAY_TRACK', payload: { track } })
})

const ConnectedNowPlaying = connect(
  mapState,
  mapDispatch
)(NowPlaying)

export default ConnectedNowPlaying
