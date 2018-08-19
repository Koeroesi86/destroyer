import AlbumView from './AlbumView.jsx'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  album: state.uiState.selectedAlbum
})

const mapDispatch = dispatch => ({
  selectAlbum: (album) => dispatch({ type: 'SELECT_ALBUM', payload: { album } })
})

const ConnectedAlbumView = connect(
  mapState,
  mapDispatch
)(AlbumView)

ConnectedAlbumView.propTypes = Object.assign({}, AlbumView.propTypes)

export default ConnectedAlbumView
