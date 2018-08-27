const fs = require('fs')
const path = require('path')
const executeQueries = require('./executeQueries')
const connectDatabase = require('./connectDatabase')

const migrations = fs.readdirSync(
  path.resolve(__dirname, '../migrations'),
  'utf8'
)
const createQueries = migrations.map(migration => ({
  query: fs.readFileSync(
    path.resolve(__dirname, `../migrations/${migration}`),
    'utf8'
  ),
  variables: []
}))

const createDatabase = (libraryLocation) => {
  let db
  return connectDatabase(libraryLocation)
    .then(database => {
      db = database
      return executeQueries(database, createQueries)
    })
    .then(() => Promise.resolve(db))
}

module.exports = createDatabase
