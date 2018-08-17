import { combineReducers } from 'redux'
import library from './library/reducer'
import folders from './folders/reducer'

const reducers = combineReducers({
  folders,
  library
})

export default reducers
