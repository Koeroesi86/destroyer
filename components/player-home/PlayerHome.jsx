import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import { FiX, FiMinimize2, FiMaximize } from 'react-icons/fi'
import style from './PlayerHome.scss'
import AlbumDetails from '../album-details'
import Equalizer from '../equalizer'
import Confirm from '../confirm'
import NowPlaying from '../now-playing'
import PlayerControls from '../player-controls'
import FolderManagement from '../folder-management'
import AudioComponent from '../audio-component'
import LocalCollection from '../local-collection'

export function formatTime (seconds) {
  return moment(Math.floor(parseFloat(seconds) * 1000), 'x', true).format('HH:mm:ss')
}

export default class PlayerHome extends Component {
  constructor (props) {
    super(props)

    this.state = {
      audioSource: null,
      audioContext: new AudioContext(), // eslint-disable-line no-undef
      confirmMessage: null
    }

    this.handleDrop = this.handleDrop.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.confirm = this.confirm.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.confirmCallback = () => {}
  }

  confirm (message, callback) {
    this.setState(() => {
      this.confirmCallback = callback
      return { confirmMessage: message }
    })
  }

  checkFile (files) {
    let contained = false
    const { folders } = this.props

    Array.prototype.forEach.call(files, file => {
      // exact match
      if (folders.find(folder => folder.path === file.path)) {
        contained = file.path
      }

      // parent directory
      if (folders.find(folder => folder.path.indexOf(file.path) === 0)) {
        contained = file.path
      }

      // child directory
      if (folders.find(folder => file.path.indexOf(folder.path) === 0)) {
        contained = file.path
      }
    })

    return contained
  }

  handleDrop (event) {
    event.preventDefault()
    event.stopPropagation()
    const { files } = event.dataTransfer

    if (files.length > 0) {
      let contained = this.checkFile(files)

      if (contained) {
        this.confirm(`Are you sure you want to add this folder? ${contained}`, () => {
          this.props.addFiles(files)
        })
      } else {
        this.props.addFiles(files)
      }
    }
  }

  handleFileChange (event) {
    event.stopPropagation()
    event.preventDefault()
    const { files } = event.target
    if (files.length > 0) {
      let contained = this.checkFile(files)

      if (contained) {
        this.confirm(`Are you sure you want to add this folder? ${contained}`, () => {
          this.props.addFiles(files)
        })
      } else {
        this.props.addFiles(files)
      }
    }
  }

  handleCancel () {
    this.confirmCallback = () => {}
    this.setState({ confirmMessage: null })
  }

  handleConfirm () {
    this.confirmCallback()
    this.confirmCallback = () => {}
    this.setState({ confirmMessage: null })
  }

  play () {
    if (this.audio) this.audio.play()
  }

  pause () {
    if (this.audio) this.audio.pause()
  }

  render () {
    const { view, setView, rescanLibrary, scanningFolder, tracks, close, minimize, maximize, maximized, enableTransparency } = this.props
    const { audioContext, audioSource, confirmMessage } = this.state
    return (
      <div
        className={classNames(style.playerHome, {
          [style.opaque]: enableTransparency,
          [style.maximized]: maximized
        })}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        <div className={style.wrapper}>
          <div className={style.mainPanel}>
            <div className={style.library}>
              <div className={style.manageLibrary}>
                <div className={style.titleBar}>
                  <div className={style.buttons}>
                    <span className={style.button} onClick={close}>
                      <FiX size={'16px'} />
                    </span>
                    <span className={style.button} onClick={minimize}>
                      <FiMinimize2 size={'16px'} />
                    </span>
                    <span className={style.button} onClick={maximize}>
                      <FiMaximize size={'16px'} />
                    </span>
                  </div>
                  <div className={style.title}>Emusic</div>
                </div>
                <FolderManagement handleFileChange={this.handleFileChange} />
              </div>
              <div className={style.collection}>
                <LocalCollection
                  view={view}
                  setView={setView}
                  rescanLibrary={rescanLibrary}
                  scanningFolder={scanningFolder}
                  tracks={tracks}
                />
              </div>
            </div>
            <div className={style.nowPlaying}>
              <NowPlaying />
            </div>
          </div>
          <PlayerControls
            play={this.play}
            pause={this.pause}
          />
        </div>
        <AlbumDetails />
        <Equalizer
          source={audioSource}
          context={audioContext}
        />
        <Confirm
          message={confirmMessage}
          confirm={this.handleConfirm}
          cancel={this.handleCancel}
        />
        <AudioComponent
          createSource={node => {
            this.audio = node
            this.setState({
              audioSource: this.state.audioContext.createMediaElementSource(node)
            })
          }}
        />
      </div>
    )
  }
}

PlayerHome.defaultProps = {
  view: 'albums',
  addFiles: () => {},
  setView: () => {},
  setCurrentTime: () => {},
  close: () => {},
  minimize: () => {},
  maximize: () => {},
  folders: [],
  tracks: [],
  currentSong: null,
  currentTime: 0,
  currentTimeFPS: 30,
  volume: 0.5,
  rescanLibrary: () => {},
  maximized: false,
  enableTransparency: true
}

export const trackType = {
  album: PropTypes.string,
  artist: PropTypes.string,
  disk: PropTypes.string,
  duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  genre: PropTypes.string,
  path: PropTypes.string,
  picture: PropTypes.string,
  title: PropTypes.string,
  track: PropTypes.string,
  year: PropTypes.string
}

PlayerHome.propTypes = {
  enableTransparency: PropTypes.bool,
  maximized: PropTypes.bool,
  view: PropTypes.string,
  close: PropTypes.func,
  minimize: PropTypes.func,
  maximize: PropTypes.func,
  addFiles: PropTypes.func,
  rescanLibrary: PropTypes.func,
  setView: PropTypes.func,
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      lastModified: PropTypes.number,
      path: PropTypes.string
    })
  ),
  scanningFolder: PropTypes.string,
  tracks: PropTypes.arrayOf(PropTypes.shape(trackType))
}
