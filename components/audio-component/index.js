import React from 'react'
import connect from 'react-redux/es/connect/connect'
import AudioComponent from './AudioComponent'
import { Audio } from '../../client/audio/context'

const mapState = state => ({
  currentSong: state.uiState.currentSong,
  currentTime: state.uiState.currentTime,
  volume: state.uiState.volume,
  port: state.uiState.port
})

const mapDispatch = dispatch => ({
  trackEnded: () => dispatch({ type: 'TRACK_ENDED', payload: {} }),
  setCurrentTime: (currentTime) => dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime } })
})

const ContextualAudioComponent = props => (
  <Audio.Consumer>
    {({ connectNode, play, pause }) =>
      <AudioComponent
        {...props}
        play={play}
        pause={pause}
        connectNode={connectNode}
    />}
  </Audio.Consumer>
)

export default window
  ? connect(mapState, mapDispatch)(ContextualAudioComponent)
  : AudioComponent
