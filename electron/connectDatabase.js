const sqlite3 = require('sqlite3').verbose()

function connectDatabase (libraryLocation) {
  return new Promise((resolve, reject) => {
    let database = new sqlite3.Database(libraryLocation, err => {
      if (err) {
        reject(err.message)
      } else {
        resolve(database)
      }
    })
  })
}

module.exports = connectDatabase
