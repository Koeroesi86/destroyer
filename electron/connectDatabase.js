const sqlite3 = require('sqlite3').verbose()
const { resolve } = require('path')

const libraryLocation = resolve(__dirname, '../database/library.sqlite')

function connectDatabase () {
  return new Promise((resolve, reject) => {
    let database = new sqlite3.Database(libraryLocation, err => {
      if (err) {
        reject(err.message)
      } else {
        resolve({ database, libraryLocation })
      }
    })
  })
}

module.exports = connectDatabase
