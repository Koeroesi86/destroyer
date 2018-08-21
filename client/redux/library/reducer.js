import path from 'path'

const initialState = {
  tracks: [],
  albums: []
}

const reducer = (state = initialState, action) => {
  if (action.type === 'STORE_LIBRARY') {
    const { library: tracks, from, to } = action.payload
    const albumsObject = {}
    state.albums.forEach(album => {
      albumsObject[album.id] = album
    })
    tracks.forEach(track => {
      const albumKey = `${path.dirname(track.path)} - ${track.album}`
      if (!albumsObject[albumKey]) {
        albumsObject[albumKey] = {
          title: track.album,
          path: path.dirname(track.path),
          artist: track.artist,
          cover: track.picture,
          duration: track.duration,
          year: track.year,
          tracks: [track]
        }
      } else {
        const album = albumsObject[albumKey]
        album.tracks.push(track)
        album.duration += track.duration
      }
    })
    const receivedAlbums = Object.getOwnPropertyNames(albumsObject).map(id =>
      Object.assign({}, albumsObject[id], { id })
    )
    console.log('received albums', receivedAlbums)
    const receivedTracks = state.tracks.slice()
    if (to) receivedTracks.splice(from, to, ...tracks)
    return Object.assign({}, state, {
      tracks: to ? receivedTracks : tracks,
      albums: receivedAlbums
    })
  }

  return state
}

export default reducer
