const fs = require('fs')
const executeQuery = require('./executeQuery')
const scanFolders = require('./scanFolders')
const addTrack = require('./addTrack')

function rescanLibrary (database, sender, forced = false) {
  console.log(`Scanning library ${forced ? 'completely' : 'wisely'}...`)
  executeQuery(database, {
    query: `SELECT * FROM folders ORDER BY path ASC`,
    variables: []
  })
    .then(folders => Promise.resolve(
      folders.filter(folder =>
        fs.existsSync(folder.path) && (folder.lastModified < Math.floor(fs.statSync(folder.path).mtimeMs) || forced)
      )
    ))
    .then(folders => scanFolders(database, folders, sender))
    .then(tracks => {
      console.log(`Updating ${tracks.length} track metadata`)
      return Promise.all(
        tracks.map(track => addTrack(database, track))
      )
    })
    .then(() => executeQuery(database, {
      query: `SELECT * FROM library ORDER BY path ASC`,
      variables: []
    }))
    .then(tracks => {
      const queries = tracks
        .filter(track => !fs.existsSync(track.path))
        .map(track => {
          console.log(`Removing non existent ${track.path}`)
          return executeQuery(database, {
            query: `DELETE FROM library WHERE path = ?`,
            variables: [track.path]
          })
        })

      console.log(`Removing ${queries.length} of ${tracks.length} songs`)

      return Promise.all(queries)
    })
    .then(() => executeQuery(database, {
      query: `SELECT * FROM library ORDER BY path ASC`,
      variables: []
    }))
    .then(library => {
      console.log(`Sending library of ${library.length} songs`)
      if (library.length <= 200) {
        sender.send('STORE_LIBRARY', { library })
      } else {
        let chunks = []
        let from = 0
        library.forEach((track, index) => {
          if (chunks.length === 200) {
            sender.send('STORE_LIBRARY', { library: chunks, to: index, from })
            chunks.splice(0)
            from = index
          }
          chunks.push(track)
        })
        sender.send('STORE_LIBRARY', { library: chunks, to: library.length - 1, from })
      }
    })
    .catch(e => console.error(e))
}

module.exports = rescanLibrary
