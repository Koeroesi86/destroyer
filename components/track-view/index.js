import TrackView from './TrackView'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  tracks: state.library.tracks,
  currentSong: state.uiState.currentSong
})

const mapDispatch = dispatch => ({
  playTracks: (tracks) => dispatch({ type: 'PLAY_TRACKS', payload: { tracks } })
})

const ConnectedTrackView = connect(
  mapState,
  mapDispatch
)(TrackView)

ConnectedTrackView.propTypes = Object.assign({}, TrackView.propTypes)

export default ConnectedTrackView