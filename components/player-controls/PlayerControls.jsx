import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { basename, extname } from 'path'
import { FiBarChart2 as EQIcon, FiVolumeX as VolumeOffIcon, FiVolume2 as VolumeFullIcon } from 'react-icons/fi'
import { MdPlayCircleOutline as PlayIcon, MdPauseCircleOutline as PauseIcon } from 'react-icons/md'
import Slider from '../slider/Slider'
import { trackType } from '../player-home/PlayerHome'
import style from './PlayerControls.scss'
import ScanProgress from '../scan-progress'
import Time from '../time'

class PlayerControls extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isPlaying: false
    }
    this.toggle = this.toggle.bind(this)
    this.props.addPlayStatusListener(isPlaying => {
      this.setState({ isPlaying })
      this.props.setPlaying(isPlaying)
    })
  }

  toggle () {
    if (this.state.isPlaying) {
      this.props.pause()
    } else {
      this.props.play()
    }
  }

  get coverStyle () {
    let {
      currentSong,
      port
    } = this.props
    const coverStyle = {}

    if (currentSong && currentSong.picture) {
      const cover = `${basename(currentSong.picture, extname(currentSong.picture))}-optimized.png`
      coverStyle.backgroundImage = `url("http://localhost:${port}/albumart/${cover}")`
    }

    return coverStyle
  }

  render () {
    const {
      currentSong,
      currentTime,
      setCurrentTime,
      openEqualizer,
      setVolume,
      volume
    } = this.props
    return (
      <div className={style.controls}>
        <div className={style.controlsPanel}>
          <div className={style.meta}>
            <div className={style.contents}>
              <div
                className={style.picture}
                style={this.coverStyle}
              />
              <div className={style.details}>
                <div className={style.title}>{currentSong ? currentSong.title : 'None'}</div>
                <div className={style.album}>{currentSong ? currentSong.album : 'None'}</div>
                <div className={style.artist}>{currentSong ? currentSong.artist : 'None'}</div>
                <div className={style.time}>
                  <Time seconds={currentTime} /> / <Time seconds={currentSong ? currentSong.duration : 0} />
                </div>
              </div>
            </div>
          </div>
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
                  className={classNames(style.mainControlButton, {
                    [style.playing]: this.state.isPlaying
                  })}
                  disabled={!currentSong}
                >
                  <PauseIcon className={style.pauseIcon} size={'40px'} />
                  <PlayIcon className={style.playIcon} size={'40px'} />
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
      </div>
    )
  }
}

PlayerControls.defaultProps = {
  currentSong: null,
  currentTime: 0,
  port: '3000',
  setCurrentTime: () => {},
  openEqualizer: () => {},
  setVolume: () => {},
  setPlaying: () => {},
  volume: 0.5,
  addPlayStatusListener: () => {},
  play: () => {},
  pause: () => {}
}

PlayerControls.propTypes = {
  currentSong: PropTypes.shape(trackType),
  currentTime: PropTypes.number,
  addPlayStatusListener: PropTypes.func,
  port: PropTypes.string,
  setCurrentTime: PropTypes.func,
  openEqualizer: PropTypes.func,
  play: PropTypes.func,
  pause: PropTypes.func,
  setVolume: PropTypes.func,
  setPlaying: PropTypes.func,
  volume: PropTypes.number
}

export default PlayerControls
