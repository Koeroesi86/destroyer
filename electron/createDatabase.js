const fs = require('fs')
const path = require('path')
const executeQueries = require('./executeQueries')
const connectDatabase = require('./connectDatabase')

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

const createDatabase = () => {
  let db
  let databaseLocation
  return connectDatabase()
    .then(({ database, libraryLocation }) => {
      db = database
      databaseLocation = libraryLocation
      return executeQueries(database, createQueries)
    })
    .then(() => Promise.resolve({ database: db, libraryLocation: databaseLocation }))
}

module.exports = createDatabase
