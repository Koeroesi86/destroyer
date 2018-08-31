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
    let src = track.path
    console.log('src', src)
    this.audio.src = /^http/.test(src) ?
      src :
      `http://localhost:${this.props.port}/local?path=${encodeURIComponent(track.path)}`
    this.audio.onerror = () => {
      console.log('error playing', track.title, src)
    }
    // this.audio.load()
    this.play()
  }

  play () {
    const playPromise = this.audio.play()

    if (playPromise) {
      playPromise
        .then(() => {
          console.log('playing', this.audio.src)
        })
        .catch(err => {
          console.error(err)
        })
    }
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
        crossOrigin='anonymous'
        onEnded={trackEnded}
      />
    )
  }
}

AudioComponent.defaultProps = {
  trackEnded: () => {},
  createSource: () => {},
  currentTime: 0,
  currentTimeFPS: 5,
  setCurrentTime: () => {},
  currentSong: null,
  port: '3000',
  volume: 0.5
}

AudioComponent.propTypes = {
  trackEnded: PropTypes.func,
  createSource: PropTypes.func,
  port: PropTypes.string,
  currentTime: PropTypes.number,
  currentTimeFPS: PropTypes.number,
  setCurrentTime: PropTypes.func,
  currentSong: PropTypes.shape(trackType),
  volume: PropTypes.number
}

export default AudioComponent
