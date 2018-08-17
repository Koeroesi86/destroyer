import { applyMiddleware, compose, createStore } from 'redux'
import connectionMiddleware from './redux/connection/middleware'
import reducers from './redux/reducers'

const initialState = {}

const middlewares = [
  connectionMiddleware
]

const middlewareEnhancers = applyMiddleware(...middlewares)
const enhancers = compose(middlewareEnhancers)

export const store = createStore(reducers, initialState, enhancers)
