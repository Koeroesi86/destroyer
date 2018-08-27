import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FiPlay, FiPause, FiBarChart2 as EQIcon, FiVolumeX as VolumeOffIcon, FiVolume2 as VolumeFullIcon } from 'react-icons/fi'
import { MdPlayCircleOutline as PlayIcon, MdPauseCircleOutline as PauseIcon } from 'react-icons/md'
import Slider from '../slider/Slider'
import { formatTime, trackType } from '../player-home/PlayerHome'
import style from './PlayerControls.scss'
import ScanProgress from '../scan-progress'

class PlayerControls extends PureComponent {
  constructor (props) {
    super(props)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  get isPlaying () {
    const { audio } = this.props

    return audio && !audio.paused
  }

  play () {
    const { audio, currentSong } = this.props

    if (audio && currentSong) audio.play()
  }

  pause () {
    const { audio, currentSong } = this.props

    if (audio && currentSong) audio.pause()
  }

  toggle () {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  render () {
    let {
      currentSong,
      currentTime,
      setCurrentTime,
      openEqualizer,
      setVolume,
      volume
    } = this.props
    return (
      <div className={style.controls}>
        {currentSong && (
          <div className={style.meta}>
            <div className={style.contents}>
              {currentSong.picture && (
                <div
                  className={style.picture}
                  style={{ backgroundImage: `url("${currentSong.picture}")` }}
                />
              )}
              <div className={style.details}>
                <div className={style.title}>{currentSong.title}</div>
                <div className={style.album}>{currentSong.album}</div>
                <div className={style.artist}>{currentSong.artist}</div>
                <div className={style.time}>
                  {formatTime(currentTime)} / {formatTime(currentSong.duration)}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={style.controlsContainer}>
          <div className={style.progress}>
            <Slider
              min={0}
              max={currentSong ? currentSong.duration : 0}
              step={0.0001}
              value={currentTime}
              onInput={e => {
                const value = e.target.value
                if (currentTime !== value) setCurrentTime(value)
              }}
              onChange={() => {
              }}
            />
          </div>
          <div className={style.mainControlContainer}>
            <div className={style.mainControlButtons}>
              <button
                onClick={this.toggle}
                className={style.mainControlButton}
                disabled={!currentSong}
              >
                {this.isPlaying ? <PauseIcon size={'40px'} /> : <PlayIcon size={'40px'} />}
              </button>
              <ScanProgress />
            </div>
            <div className={style.volume}>
              <div
                onClick={openEqualizer}
                className={style.icon}
              >
                <EQIcon size={'16px'} />
              </div>
              <div
                className={style.icon}
                onClick={() => {
                  setVolume(0)
                }}
              >
                <VolumeOffIcon size={'16px'} />
              </div>
              <div className={style.slider}>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onInput={e => {
                    setVolume(e.target.value)
                  }}
                  onChange={() => {}}
                />
              </div>
              <div
                className={style.icon}
                onClick={() => {
                  setVolume(1)
                }}
              >
                <VolumeFullIcon size={'16px'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PlayerControls.defaultProps = {
  currentSong: null,
  currentTime: 0,
  audio: null,
  setCurrentTime: () => {},
  openEqualizer: () => {},
  setVolume: () => {},
  volume: 0.5
}

PlayerControls.propTypes = {
  currentSong: PropTypes.shape(trackType),
  currentTime: PropTypes.number,
  setCurrentTime: PropTypes.func,
  openEqualizer: PropTypes.func,
  setVolume: PropTypes.func,
  volume: PropTypes.number,
  audio: PropTypes.instanceOf(HTMLElement) // eslint-disable-line no-undef
}

export default PlayerControls
