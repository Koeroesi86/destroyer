import AlbumDetails from './AlbumDetails'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  album: state.uiState.selectedAlbum
})

const mapDispatch = dispatch => ({
  playTracks: (tracks) => dispatch({ type: 'PLAY_TRACKS', payload: { tracks } }),
  close: () => dispatch({ type: 'SELECT_ALBUM', payload: { album: null } })
})

const ConnectedAlbumDetails = connect(
  mapState,
  mapDispatch
)(AlbumDetails)

ConnectedAlbumDetails.propTypes = Object.assign({}, AlbumDetails.propTypes)

export default ConnectedAlbumDetails
