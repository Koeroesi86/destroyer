import { applyMiddleware, compose, createStore } from 'redux'
import connectionMiddleware from './redux/connection/middleware'
import uiStateMiddleware from './redux/uiState/middleware'
import reducers from './redux/reducers'

const initialState = {}

const middlewares = [
  connectionMiddleware,
  uiStateMiddleware
]

const middlewareEnhancers = applyMiddleware(...middlewares)
const enhancers = compose(middlewareEnhancers)

export const store = createStore(reducers, initialState, enhancers)
