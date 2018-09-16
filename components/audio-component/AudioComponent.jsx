import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { trackType } from '../player-home/PlayerHome'

class AudioComponent extends PureComponent {
  componentDidMount () {
    if (this.audio) {
      this.setVolume()

      this.props.connectNode(this.audio)
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentSong !== this.props.currentSong) {
      if (this.props.currentSong) {
        this.playTrack(this.props.currentSong)
      } else {
        this.audio.src = ''
      }
    }

    if (prevProps.volume !== this.props.volume) {
      this.setVolume()
    }
  }

  playTrack (track) {
    let src = track.path
    if (/^http/.test(src)) {
      this.audio.src = src
    } else {
      this.audio.src = `http://localhost:${this.props.port}/local?path=${encodeURIComponent(track.path)}`
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
  connectNode: () => {},
  setPlaying: () => {},
  currentSong: null,
  port: '3000',
  volume: 0.5
}

AudioComponent.propTypes = {
  trackEnded: PropTypes.func,
  connectNode: PropTypes.func,
  port: PropTypes.string,
  currentSong: PropTypes.shape(trackType),
  volume: PropTypes.number
}

export default AudioComponent
