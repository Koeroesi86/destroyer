const middleware = store => next => action => {
  next(action)
}

export default middleware
