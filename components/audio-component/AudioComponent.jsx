import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { trackType } from '../player-home/PlayerHome'

class AudioComponent extends PureComponent {
  componentDidMount () {
    if (this.audio) {
      this.setVolume()
      this.seekTo(this.props.currentTime)

      this.props.createSource(this.audio)
    }

    this.timer = setInterval(() => {
      if (Math.floor(this.audio.currentTime * 100) !== Math.floor(this.props.currentTime * 100)) {
        this.props.setCurrentTime(this.audio.currentTime)
      }
    }, 1000 / this.props.currentTimeFPS)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentSong !== this.props.currentSong) {
      if (this.props.currentSong) {
        this.playTrack(this.props.currentSong)
      } else {
        this.pause()
      }
    }

    if (prevProps.volume !== this.props.volume) {
      this.setVolume()
    }

    if (prevProps.currentTime !== this.props.currentTime) {
      this.seekTo(this.props.currentTime)
    }
  }

  playTrack (track) {
    this.audio.src = 'file://' + track.path
    this.play()
  }

  play () {
    this.audio.play()
  }

  pause () {
    this.audio.pause()
  }

  seekTo (currentTime) {
    if (!this.audio.paused && this.audio.currentTime !== currentTime) {
      this.audio.currentTime = currentTime
    }
  }

  setVolume () {
    if (this.audio.volume !== this.props.volume) {
      this.audio.volume = this.props.volume
    }
  }

  render () {
    const { trackEnded } = this.props
    return (
      <audio
        style={{ display: 'none' }}
        ref={a => {
          this.audio = a
        }}
        onEnded={trackEnded}
        // onTimeUpdate={(e) => {
        //   this.props.setCurrentTime(Math.floor(e.target.currentTime))
        // }}
      />
    )
  }
}

AudioComponent.defaultProps = {
  trackEnded: () => {},
  createSource: () => {},
  currentTime: 0,
  currentTimeFPS: 30,
  setCurrentTime: () => {},
  currentSong: null,
  volume: 0.5
}

AudioComponent.propTypes = {
  trackEnded: PropTypes.func,
  createSource: PropTypes.func,
  currentTime: PropTypes.number,
  currentTimeFPS: PropTypes.number,
  setCurrentTime: PropTypes.func,
  currentSong: PropTypes.shape(trackType),
  volume: PropTypes.number
}

export default AudioComponent
