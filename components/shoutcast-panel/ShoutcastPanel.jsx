import React from 'react'
import style from './ShoutcastPanel.scss'

function ShoutCastPanel (props) {
  return (
    <webview
      className={style.shoutCastPanel}
      src={'http://www.shoutcast.com/scradioinwinamp/'}
    />
  )
}

export default ShoutCastPanel
