import path from 'path'

const initialState = {
  tracks: [],
  albums: [],
  loaded: false
}

const reducer = (state = initialState, action) => {
  if (action.type === 'STORE_LIBRARY') {
    const { library: tracks, finished } = action.payload
    const albumsObject = {}
    state.albums.forEach(album => {
      albumsObject[album.id] = album
    })
    tracks.forEach(track => {
      const albumKey = `${path.dirname(track.path)} - ${track.album}`
      if (track.picture) {
        track.picture = track.picture.replace(/^file:\/\//, '')
      }
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
        const existingTrack = album.tracks.find(t => track.path === t.path)
        if (!existingTrack) {
          album.tracks.push(track)
          album.duration += track.duration
        } else {
          album.duration -= existingTrack.duration
          Object.assign(existingTrack, track)
          album.duration += track.duration
        }
      }
    })
    const receivedAlbums = Object.getOwnPropertyNames(albumsObject).map(id =>
      Object.assign({}, albumsObject[id], { id })
    )
    return Object.assign({}, state, {
      tracks: tracks,
      albums: receivedAlbums,
      loaded: !!finished
    })
  }

  return state
}

export default reducer
