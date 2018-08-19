import AlbumView from './AlbumView.jsx'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  albums: state.library.albums,
  album: state.uiState.selectedAlbum
})

const mapDispatch = dispatch => ({
  selectAlbum: (album) => dispatch({ type: 'SELECT_ALBUM', payload: { album } }),
  playTracks: (tracks) => dispatch({ type: 'PLAY_TRACKS', payload: { tracks } })
})

const ConnectedAlbumView = connect(
  mapState,
  mapDispatch
)(AlbumView)

ConnectedAlbumView.propTypes = Object.assign({}, AlbumView.propTypes)

export default ConnectedAlbumView
