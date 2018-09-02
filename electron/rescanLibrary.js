const fs = require('fs')
const executeQuery = require('./executeQuery')
const scanFolders = require('./scanFolders')

function rescanLibrary (sender, forced = false) {
  const database = global._database
  console.log(`Scanning library ${forced ? 'completely' : 'wisely'}...`)
  executeQuery(database, {
    query: `SELECT * FROM folders ORDER BY path ASC`,
    variables: []
  })
    .then(folders => {
      folders.map(folder => executeQuery(database, {
        query: `INSERT OR REPLACE INTO folders (path, lastModified) VALUES (?, ?)`,
        variables: [
          folder.path,
          Math.floor(fs.statSync(folder.path).mtimeMs)
        ]
      }))
      return Promise.resolve(
        folders.filter(folder =>
          fs.existsSync(folder.path) && (folder.lastModified < Math.floor(fs.statSync(folder.path).mtimeMs) || forced)
        )
      )
    })
    .then(folders => scanFolders(folders, sender))
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
        sender.send('STORE_LIBRARY', { library, finished: true })
      } else {
        let chunks = []
        let from = 0
        library.forEach((track, index) => {
          if (chunks.length === 200) {
            sender.send('STORE_LIBRARY', { library: chunks, to: index, from, finished: false })
            chunks.splice(0)
            from = index
          }
          chunks.push(track)
        })
        sender.send('STORE_LIBRARY', { library: chunks, to: library.length - 1, from, finished: true })
      }
    })
    .catch(e => console.error(e))
}

module.exports = rescanLibrary
