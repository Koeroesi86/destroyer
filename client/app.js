import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import PlayerHome from '../components/player-home'
import { store } from './redux/store'
import { Audio } from './audio/context'

if (typeof document !== 'undefined') {
  store.dispatch({ type: 'APP_INIT' })

  ReactDOM.render(
    <Provider store={store} audio={Audio}>
      <PlayerHome />
    </Provider>,
    document.getElementById('root')
  )
}
