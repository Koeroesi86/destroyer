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
import AudioComponent from '../audio-component'
import LocalCollection from '../local-collection'
import TitleBar from '../title-bar'
import ShoutCastPanel from '../shoutcast-panel'
import Navigation from '../navigation'

export function formatTime (seconds) {
  return moment(Math.floor(parseFloat(seconds) * 1000), 'x', true).format('HH:mm:ss')
}

export default class PlayerHome extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      audioSource: null,
      confirmMessage: null
    }

    this.audioContext = new AudioContext() // eslint-disable-line no-undef

    this.confirm = this.confirm.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.createMediaElementSource = this.createMediaElementSource.bind(this)
    this.addFiles = this.addFiles.bind(this)
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

  addFiles (files) {
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

  createMediaElementSource (node) {
    this.audio = node
    this.setState({
      audioSource: this.audioContext.createMediaElementSource(node)
    })
  }

  render () {
    const { maximized, enableTransparency, loaded, tab } = this.props
    const { audioSource, confirmMessage } = this.state
    return (
      <div
        className={classNames(style.playerHome, {
          [style.opaque]: enableTransparency,
          [style.maximized]: maximized,
          [style.loaded]: loaded
        })}
      >
        <div className={style.wrapper}>
          <div className={style.mainPanel}>
            <div className={style.library}>
              <div className={style.manageLibrary}>
                <div className={style.manageLibraryPanel}>
                  <TitleBar />
                  <div className={style.navigationContainer}>
                    <Navigation />
                  </div>
                </div>
              </div>
              <div className={style.collection}>
                <div className={classNames(style.tab, {
                  [style.active]: tab === 'local'
                })}>
                  <LocalCollection addFiles={this.addFiles} />
                </div>
                <div className={classNames(style.tab, {
                  [style.active]: tab === 'now-playing'
                })}>
                  <NowPlaying />
                </div>
                <div className={classNames(style.tab, {
                  [style.active]: tab === 'shoutcast'
                })}>
                  <ShoutCastPanel />
                </div>
              </div>
            </div>
          </div>
          <PlayerControls audio={this.audio} />
        </div>
        <AlbumDetails />
        <Equalizer
          source={audioSource}
          context={this.audioContext}
        />
        <Confirm
          message={confirmMessage}
          confirm={this.handleConfirm}
          cancel={this.handleCancel}
        />
        <AudioComponent
          createSource={this.createMediaElementSource}
        />
      </div>
    )
  }
}

PlayerHome.defaultProps = {
  addFiles: () => {},
  tab: 'local',
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
  tab: PropTypes.string,
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      lastModified: PropTypes.number,
      path: PropTypes.string
    })
  )
}
