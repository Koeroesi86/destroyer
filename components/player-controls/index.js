import React from 'react'
import connect from 'react-redux/es/connect/connect'
import PlayerControls from './PlayerControls'
import { Audio } from '../../client/audio/context'

const mapState = (state) => ({
  port: state.uiState.port,
  volume: state.uiState.volume,
  currentTime: state.uiState.currentTime,
  currentSong: state.uiState.currentSong
})

const mapDispatch = (dispatch) => ({
  setCurrentTime: (currentTime) => dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime } }),
  openEqualizer: () => dispatch({ type: 'SET_TAB', payload: { tab: 'equalizer' } }),
  setPlaying: (isPlaying) => dispatch({ type: 'SET_PLAYING', payload: { isPlaying } }),
  setVolume: (volume) => dispatch({ type: 'SET_VOLUME', payload: { volume } })
})

const ContextualPlayerControls = props => (
  <Audio.Consumer>
    {({ addPlayStatusListener, play, pause }) =>
      <PlayerControls
        {...props}
        play={play}
        pause={pause}
        addPlayStatusListener={addPlayStatusListener}
      />}
  </Audio.Consumer>
)

export default window
  ? connect(mapState, mapDispatch)(ContextualPlayerControls)
  : PlayerControls
