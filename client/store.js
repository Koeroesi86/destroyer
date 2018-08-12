import { applyMiddleware, compose, createStore } from 'redux'
import connectionMiddleware from './redux/connection/middleware'

const initialState = {}

const reducers = (state, action) => state
const middlewares = [
  connectionMiddleware
]

const middlewareEnhancers = applyMiddleware(...middlewares)
const enhancers = compose(middlewareEnhancers)

export const store = createStore(reducers, initialState, enhancers)
