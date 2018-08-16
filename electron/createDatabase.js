const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')
const executeQueries = require('./executeQueries')

const migrations = fs.readdirSync(
  path.resolve(__dirname, '../database/migrations'),
  'utf8'
)
const createQueries = migrations.map(migration => ({
  query: fs.readFileSync(
    path.resolve(__dirname, `../database/migrations/${migration}`),
    'utf8'
  ),
  variables: []
}))

const createDatabase = databaseLocation => new Promise((resolve, reject) => {
  let db = new sqlite3.Database(databaseLocation, err => {
    if (err) {
      reject(err.message)
    } else {
      executeQueries(db, createQueries)
        .then(() => resolve(db))
        .catch(message => reject(message))
    }
  })
})

module.exports = createDatabase
