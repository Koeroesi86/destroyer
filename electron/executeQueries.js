const executeQuery = require('./executeQuery')

/** return Promise */
function executeQueries (db, queries) {
  const promises = queries.map(query => executeQuery(db, query))

  return Promise.all(promises)
}

module.exports = executeQueries
