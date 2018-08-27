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

export default window
  ? connect(mapState, mapDispatch)(AlbumView)
  : AlbumView
