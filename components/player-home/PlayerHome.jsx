import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faVolumeUp, faVolumeDown } from '@fortawesome/free-solid-svg-icons'
import style from './PlayerHome.scss'
import AlbumView from '../album-view'
import TrackView from '../track-view'
import Slider from '../slider/Slider'
// import Fuzz from '../fuzz'

export function formatTime (seconds) {
  return moment(Math.floor(parseFloat(seconds) * 1000), 'x', true).format('HH:mm:ss')
}

export default class PlayerHome extends Component {
  constructor (props) {
    super(props)

    this.state = {
      albums: {}
    }

    this.handleDrop = this.handleDrop.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.playTrack = this.playTrack.bind(this)
    this.playAlbum = this.playAlbum.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  componentDidMount () {
    if (this.upload) {
      this.upload.allowdirs = true
      this.upload.webkitdirectory = true
    }

    if (this.audio) {
      this.setVolume()
    }

    this.seekTo(this.props.currentTime)

    this.timer = setInterval(() => {
      if (this.audio.currentTime !== this.props.currentTime) {
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
    this.audio.src = track.path
    this.audio.play()
  }

  playAlbum (album) {
    this.props.playTracks(album.tracks)
  }

  play () {
    this.audio.play()
  }

  pause () {
    this.audio.pause()
  }

  seekTo (currentTime) {
    if (this.audio.currentTime !== currentTime) {
      this.audio.currentTime = currentTime
    }
  }

  setVolume () {
    this.audio.volume = this.props.volume
  }

  render () {
    const { currentSong, currentTime, setCurrentTime, setVolume, volume, folders, view, nowPlaying } = this.props
    return (
      <div
        className={style.PlayerHome}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        <div className={style.mainPanel}>
          <div className={style.controls}>
            <Slider
              min={0}
              max={currentSong ? currentSong.duration : 0}
              step={0.0001}
              value={currentTime}
              onInput={e => { setCurrentTime(e.target.value) }}
              onChange={() => {}}
            />
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
                  onClick={() => { setVolume(0) }}
                >
                  <FontAwesomeIcon icon={faVolumeDown} size='sm' />
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onInput={e => { setVolume(e.target.value) }}
                  onChange={() => {}}
                />
                <div
                  className={style.volumeIcon}
                  onClick={() => { this.props.setVolume(1) }}
                >
                  <FontAwesomeIcon icon={faVolumeUp} size='sm' />
                </div>
              </div>
              {currentSong && (
                <div className={style.meta}>
                  {currentSong.picture && (
                    <div
                      className={style.picture}
                      style={{ backgroundImage: `url("${currentSong.picture}")` }}
                    />
                  )}
                  <div className={style.artist}>{currentSong.artist}</div>
                  <div className={style.separator}>//</div>
                  <div className={style.album}>{currentSong.album}</div>
                  <div className={style.separator}>//</div>
                  <div className={style.title}>{currentSong.title}</div>
                </div>
              )}
              {currentSong && (
                <div className={style.time}>
                  {formatTime(currentTime)} / {formatTime(currentSong.duration)}
                </div>
              )}
            </div>
            <audio
              ref={a => { this.audio = a }}
              onEnded={() => { this.props.trackEnded() }}
            />
          </div>
          <div className={style.library}>
            <div className={style.manageLibrary}>
              <div className={style.sectionTitle}>
                Folders
              </div>
              <div className={style.folders}>
                {folders.map(folder => (
                  <div
                    key={folder.path}
                    className={style.folder}
                    title={folder.path}
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
              {this.props.tracks.length === 0 && (
                <div>Library placeholder</div>
              )}
              <div className={style.viewControls}>
                <div
                  className={classNames(style.view, {
                    [style.current]: view === 'albums'
                  })}
                  onClick={() => this.props.setView('albums')}
                >
                  Albums
                </div>
                <div
                  className={classNames(style.view, {
                    [style.current]: view === 'tracks'
                  })}
                  onClick={() => this.props.setView('tracks')}
                >
                  Songs
                </div>
              </div>
              <div className={style.viewPanels}>
                <div className={classNames(style.albums, {
                  [style.active]: view === 'albums'
                })}>
                  <AlbumView
                    albums={this.props.albums}
                    playAlbum={this.playAlbum}
                  />
                </div>
                <div className={classNames(style.albums, {
                  [style.active]: view === 'tracks'
                })}>
                  <TrackView />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.nowPlaying}>
          <div className={style.header}>Now playing</div>
          <div className={style.tracks}>
            {nowPlaying.map(track => (
              <div
                key={track.path}
                className={classNames(style.track, {
                  [style.current]: currentSong && track.path === currentSong.path
                })}
                onDoubleClick={() => this.props.playTrack(track)}
                title={`${track.track ? track.track + ' - ' : ''}${track.title}`}
                >
                {track.track && track.track + ' - '}
                {track.title}
              </div>
              ))}
          </div>
        </div>
      </div>
    )
  }
}

PlayerHome.defaultProps = {
  view: 'albums',
  addFiles: () => {},
  playTrack: () => {},
  trackEnded: () => {},
  playTracks: () => {},
  setView: () => {},
  setCurrentTime: () => {},
  folders: [],
  albums: [],
  tracks: [],
  currentSong: null,
  currentTime: 0,
  currentTimeFPS: 100,
  volume: 0.5,
  setVolume: () => {}
}

export const trackType = {
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
}

PlayerHome.propTypes = {
  view: PropTypes.string,
  addFiles: PropTypes.func,
  playTrack: PropTypes.func,
  trackEnded: PropTypes.func,
  playTracks: PropTypes.func,
  volume: PropTypes.number,
  setVolume: PropTypes.func,
  setView: PropTypes.func,
  setCurrentTime: PropTypes.func,
  currentTimeFPS: PropTypes.number,
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      lastModified: PropTypes.number,
      path: PropTypes.string
    })
  ),
  currentSong: PropTypes.shape(trackType),
  currentTime: PropTypes.number,
  nowPlaying: PropTypes.arrayOf(PropTypes.shape(trackType)),
  albums: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.string,
      cover: PropTypes.string,
      duration: PropTypes.number,
      year: PropTypes.string,
      tracks: PropTypes.arrayOf(PropTypes.shape(trackType))
    })
  ),
  tracks: PropTypes.arrayOf(PropTypes.shape(trackType))
}
