import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faVolumeUp, faVolumeDown } from '@fortawesome/free-solid-svg-icons'
import style from './PlayerHome.scss'

export default class PlayerHome extends Component {
  constructor (props) {
    super(props)

    this.state = {
      duration: 1,
      currentTime: 0,
      volume: 0.5
    }

    this.handleDrop = this.handleDrop.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.playTrack = this.playTrack.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  componentDidMount () {
    if (this.upload) {
      this.upload.allowdirs = true
      this.upload.webkitdirectory = true
    }

    if (this.audio) {
      this.audio.volume = this.state.volume
    }
  }

  componentDidUpdate () {
    //
  }

  handleDrop (event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer.files.length > 0) {
      this.props.addFiles(event.dataTransfer.files)
    }
  }

  handleFileChange (event) {
    event.stopPropagation()
    event.preventDefault()
    const { files } = event.target
    this.props.addFiles(files)
  }

  playTrack (track) {
    this.props.playTrack(track)
    this.audio.src = track.path
    this.audio.play()
  }

  play () {
    this.audio.play()
  }

  pause () {
    this.audio.pause()
  }

  setVolume (volume) {
    this.audio.volume = volume
    this.setState({ volume })
  }

  onTimeUpdate (currentTime) {
    this.setState({ currentTime })
  }

  onDurationChange (duration) {
    this.setState({ duration })
  }

  seekTo(currentTime) {
    this.setState({ currentTime }, () => {
      this.audio.currentTime = currentTime
    })
  }

  formatTime (seconds) {
    // return moment(seconds, 's', true).format('HH:mm:ss')
    return moment(Math.floor(parseFloat(seconds) * 1000), 'x', true).format('HH:mm:ss')
  }

  render () {
    return (
      <div
        className={style.PlayerHome}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        <div className={style.mainPanel}>
          <div className={style.controls}>
            <div className={style.seekSliderContainer}>
              <input
                type='range'
                step={0.01}
                min={0}
                max={this.state.duration}
                value={this.state.currentTime}
                className={style.seekSlider}
                onInput={e => { this.seekTo(e.target.value) }}
                onChange={() => {}}
              />
              <div
                className={style.lowerFill}
                style={{ width: `${(this.state.currentTime / this.state.duration) * 100}%` }}
              >
                &nbsp;
              </div>
            </div>
            <div className={style.mainControlContainer}>
              <button
                onClick={this.play}
                className={style.mainControlButton}
              >
                <FontAwesomeIcon icon={faPlay} size='sm' />
              </button>
              <button
                onClick={this.pause}
                className={style.mainControlButton}
              >
                <FontAwesomeIcon icon={faPause} size='sm' />
              </button>
              <div className={style.volume}>
                <div
                  className={style.volumeIcon}
                  onClick={() => { this.setVolume(0) }}
                >
                  <FontAwesomeIcon icon={faVolumeDown} size='sm' />
                </div>
                <div className={style.volumeSliderContainer}>
                  <input
                    type='range'
                    min={0}
                    max={1}
                    step={0.01}
                    value={this.state.volume}
                    className={style.volumeSlider}
                    onInput={e => { this.setVolume(e.target.value) }}
                    onChange={() => {}}
                  />
                  <div
                    className={style.lowerFill}
                    style={{ width: `${this.state.volume * 100}%` }}
                  >
                    &nbsp;
                  </div>
                </div>
                <div
                  className={style.volumeIcon}
                  onClick={() => { this.setVolume(1) }}
                >
                  <FontAwesomeIcon icon={faVolumeUp} size='sm' />
                </div>
              </div>
              <div className={style.time}>
                {this.formatTime(this.state.currentTime)} / {this.formatTime(this.state.duration)}
              </div>
            </div>
            <audio
              ref={a => { this.audio = a }}
              onTimeUpdate={e => { this.onTimeUpdate(e.target.currentTime) }}
              onDurationChange={e => { this.onDurationChange(e.target.duration) }}
            />
          </div>
          <div className={style.library}>
            <div className={style.manageLibrary}>
              <div className={style.sectionTitle}>
                Folders
              </div>
              <div className={style.folders}>
                {this.props.folders.map(folder => (
                  <div
                    key={folder.path}
                    title={folder.lastModified}
                    className={style.folder}
                  >
                    {folder.path}
                  </div>
                ))}
                <div
                  className={style.addItems}
                  onClick={() => { this.upload.click() }}
                >
                  Drop music folders here
                  <input
                    type='file'
                    ref={ref => { this.upload = ref }}
                    className={style.fileInput}
                    multiple
                    onChange={this.handleFileChange}
                  />
                </div>
              </div>
            </div>
            <div className={style.collection}>
              {this.props.library.length === 0 && (
                <div>Library placeholder</div>
              )}
              {this.props.library.map(track => (
                <div
                  key={track.path}
                  className={style.album}
                  onDoubleClick={() => this.playTrack(track)}
                  onTouchEnd={() => this.playTrack(track)}
                >
                  <div
                    title={track.album}
                    className={style.cover}
                    style={{
                      backgroundImage: track.picture ? `url("${track.picture}")` : ''
                    }}
                  />
                  <div className={style.meta}>
                    <div>{track.artist}</div>
                    <div>{track.album}</div>
                    <div>{track.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={style.nowPlaying}>
          Now playing
        </div>
      </div>
    )
  }
}

PlayerHome.defaultProps = {
  addFiles: () => {},
  playTrack: () => {},
  folders: [],
  library: []
}

PlayerHome.propTypes = {
  addFiles: PropTypes.func,
  playTrack: PropTypes.func,
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      lastModified: PropTypes.number,
      path: PropTypes.string
    })
  ),
  library: PropTypes.arrayOf(PropTypes.shape({
    album: PropTypes.string,
    artist: PropTypes.string,
    disk: PropTypes.string,
    duration: PropTypes.number,
    genre: PropTypes.string,
    path: PropTypes.string,
    picture: PropTypes.string,
    title: PropTypes.string,
    track: PropTypes.string,
    year: PropTypes.string
  }))
}
