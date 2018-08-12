import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import PlayerHome from '../components/player-home'
import { store } from './store'

if (typeof document !== 'undefined') {
  store.dispatch({ type: 'APP_INIT' })

  ReactDOM.render(
    <Provider store={store}>
      <PlayerHome />
    </Provider>,
    document.getElementById('root')
  )
}
