import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import style from './PlayerHome.scss'
import AlbumDetails from '../album-details'
import Equalizer from '../equalizer'
import Confirm from '../confirm'
import NowPlaying from '../now-playing'
import PlayerControls from '../player-controls'
import FolderManagement from '../folder-management'
import AudioComponent from '../audio-component'
import LocalCollection from '../local-collection'
import TitleBar from '../title-bar'

export function formatTime (seconds) {
  return moment(Math.floor(parseFloat(seconds) * 1000), 'x', true).format('HH:mm:ss')
}

export default class PlayerHome extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      audioSource: null,
      audioContext: new AudioContext(), // eslint-disable-line no-undef
      confirmMessage: null
    }

    this.handleDrop = this.handleDrop.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
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

  render () {
    const { maximized, enableTransparency, loaded } = this.props
    const { audioContext, audioSource, confirmMessage } = this.state
    return (
      <div
        className={classNames(style.playerHome, {
          [style.opaque]: enableTransparency,
          [style.maximized]: maximized,
          [style.loaded]: loaded
        })}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        <div className={style.wrapper}>
          <div className={style.mainPanel}>
            <div className={style.library}>
              <div className={style.manageLibrary}>
                <TitleBar />
                <FolderManagement handleFileChange={this.handleFileChange} />
              </div>
              <div className={style.collection}>
                <LocalCollection />
              </div>
            </div>
            <div className={style.nowPlaying}>
              <NowPlaying />
            </div>
          </div>
          <PlayerControls audio={this.audio} />
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
  addFiles: () => {},
  currentSong: null,
  maximized: false,
  enableTransparency: true,
  loaded: false
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
  loaded: PropTypes.bool,
  maximized: PropTypes.bool,
  addFiles: PropTypes.func,
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      lastModified: PropTypes.number,
      path: PropTypes.string
    })
  )
}
