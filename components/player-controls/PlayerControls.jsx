import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faSignal, faVolumeDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import Slider from '../slider/Slider'
import { formatTime, trackType } from '../player-home/PlayerHome'
import style from './PlayerControls.scss'

function PlayerControls ({
   currentSong,
   currentTime,
   setCurrentTime,
   openEqualizer,
   play,
   pause,
   setVolume,
   volume
}) {
  return (
    <div className={style.controls}>
      {currentSong && (
        <div className={style.meta}>
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
      )}
      <div className={style.controlsContainer}>
        <div className={style.progress}>
          <Slider
            min={0}
            max={currentSong ? currentSong.duration : 0}
            step={0.0001}
            value={currentTime}
            onInput={e => {
              setCurrentTime(e.target.value)
            }}
            onChange={() => {
            }}
          />
        </div>
        <div className={style.mainControlContainer}>
          <div className={style.mainControlButtons}>
            <button
              onClick={play}
              className={style.mainControlButton}
              disabled={!currentSong}
            >
              <FontAwesomeIcon icon={faPlay} size='sm' />
            </button>
            <button
              onClick={pause}
              className={style.mainControlButton}
              disabled={!currentSong}
            >
              <FontAwesomeIcon icon={faPause} size='sm' />
            </button>
            <button
              onClick={openEqualizer}
              className={style.mainControlButton}
            >
              <FontAwesomeIcon icon={faSignal} size='sm' />
            </button>
          </div>
          <div className={style.volume}>
            <div
              className={style.volumeIcon}
              onClick={() => {
                setVolume(0)
              }}
            >
              <FontAwesomeIcon icon={faVolumeDown} size='sm' />
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onInput={e => {
                setVolume(e.target.value)
              }}
              onChange={() => {
              }}
            />
            <div
              className={style.volumeIcon}
              onClick={() => {
                setVolume(1)
              }}
            >
              <FontAwesomeIcon icon={faVolumeUp} size='sm' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PlayerControls.defaultProps = {
  currentSong: null,
  currentTime: 0,
  setCurrentTime: () => {},
  openEqualizer: () => {},
  play: () => {},
  pause: () => {},
  setVolume: () => {},
  volume: 0.5
}

PlayerControls.propTypes = {
  currentSong: PropTypes.shape(trackType),
  currentTime: PropTypes.number,
  setCurrentTime: PropTypes.func,
  openEqualizer: PropTypes.func,
  play: PropTypes.func,
  pause: PropTypes.func,
  setVolume: PropTypes.func,
  volume: PropTypes.number
}

export default PlayerControls
