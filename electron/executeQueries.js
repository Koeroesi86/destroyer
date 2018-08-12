const executeQuery = require('./executeQuery')

function executeQueries (db, queries) {
  const promises = queries.map(query => executeQuery(db, query))

  return Promise.all(promises)
}

module.exports = executeQueries
