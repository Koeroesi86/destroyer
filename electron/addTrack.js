const executeQuery = require('./executeQuery')

function addTrack (database, track) {
  return executeQuery(database, {
    query: `INSERT OR REPLACE INTO library (path, artist, album, title, year, track, disk, genre, picture, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    variables: [
      track.path,
      track.artist,
      track.album,
      track.title,
      track.year,
      track.track,
      track.disk,
      track.genre,
      track.picture,
      track.duration
    ]
  })
}

module.exports = addTrack
