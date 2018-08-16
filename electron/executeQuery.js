/** return Promise */
function executeQuery (db, query) {
  return new Promise((resolve, reject) => {
    db.all(query.query, query.variables, (err, result) => {
      if (err) {
        reject(err.message)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = executeQuery
