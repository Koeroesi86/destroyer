import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { trackType } from '../player-home/PlayerHome'

class AudioComponent extends PureComponent {
  componentDidMount () {
    if (this.audio) {
      this.setVolume()
      this.seekTo(this.props.currentTime)

      this.props.connectNode(this.audio)
    }

    const round = (number) => Math.floor(number * 100)
    this.timer = setInterval(() => {
      const changed = round(this.audio.currentTime) !== round(this.props.currentTime)
      if (this.props.isPlaying && changed) {
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
        this.props.pause()
      }
    }

    if (prevProps.volume !== this.props.volume) {
      this.setVolume()
    }

    if (prevProps.currentTime !== this.props.currentTime) {
      this.seekTo(this.props.currentTime)
    }

    if (this.props.isPlaying !== prevProps.isPlaying) {
      if (this.props.isPlaying) {
        this.props.play()
      } else {
        this.props.pause()
      }
    }
  }

  playTrack (track) {
    let src = track.path
    if (/^http/.test(src)) {
      this.audio.src = src
    } else {
      this.audio.src = `http://localhost:${this.props.port}/local?path=${encodeURIComponent(track.path)}`
    }

    if (this.props.isPlaying) this.props.play()
  }

  seekTo (currentTime) {
    if (this.audio.currentTime !== currentTime) {
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
        crossOrigin='anonymous'
        onEnded={trackEnded}
      />
    )
  }
}

AudioComponent.defaultProps = {
  play: () => {},
  pause: () => {},
  trackEnded: () => {},
  connectNode: () => {},
  isPlaying: false,
  setPlaying: () => {},
  currentTime: 0,
  currentTimeFPS: 5,
  setCurrentTime: () => {},
  currentSong: null,
  port: '3000',
  volume: 0.5
}

AudioComponent.propTypes = {
  play: PropTypes.func,
  pause: PropTypes.func,
  isPlaying: PropTypes.bool,
  trackEnded: PropTypes.func,
  connectNode: PropTypes.func,
  port: PropTypes.string,
  currentTime: PropTypes.number,
  currentTimeFPS: PropTypes.number,
  setCurrentTime: PropTypes.func,
  currentSong: PropTypes.shape(trackType),
  volume: PropTypes.number
}

export default AudioComponent
