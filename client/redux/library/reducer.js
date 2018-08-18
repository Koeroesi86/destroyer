const initialState = {
  tracks: [],
  albums: []
}

const reducer = (state = initialState, action) => {
  if (action.type === 'STORE_LIBRARY') {
    const tracks = action.payload.library
    const albumsObject = {}
    tracks.forEach(track => {
      const albumKey = `${track.artist} - ${track.year} - ${track.album}`
      if (!albumsObject[albumKey]) {
        albumsObject[albumKey] = {
          title: track.album,
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
    const albums = Object.getOwnPropertyNames(albumsObject).map(id =>
      Object.assign({}, albumsObject[id], { id })
    )
    console.log('received albums', albums)
    return {
      tracks,
      albums
    }
  }

  return state
}

export default reducer
