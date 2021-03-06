import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './PlayerHome.scss'
import AlbumDetails from '../album-details'
import Confirm from '../confirm'
import PlayerControls from '../player-controls'
import AudioComponent from '../audio-component'
import TitleBar from '../title-bar'
import Navigation from '../navigation'
import AudioSpectrum from '../audio-spectrum'
import PlayerTabs from '../player-tabs'

export default class PlayerHome extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      confirmMessage: null
    }

    this.confirm = this.confirm.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.addFiles = this.addFiles.bind(this)
    this.confirmCallback = () => {}
    window.addEventListener('beforeunload', () => {
      this.props.onUnload()
    })
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

  render () {
    const { maximized, enableTransparency, loaded } = this.props
    const { confirmMessage } = this.state
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
                    <AudioSpectrum
                      width={180}
                      height={80}
                      meterColor={'rgba(255, 255, 255, 0.4)'}
                      capColor={'rgba(255, 255, 255, 0.8)'}
                      capHeight={1}
                      meterCount={45}
                      meterWidth={2}
                      gap={2}
                    />
                    <Navigation />
                  </div>
                </div>
              </div>
              <PlayerTabs addFiles={this.addFiles} />
            </div>
          </div>
          <PlayerControls />
        </div>
        <AlbumDetails />
        <Confirm
          message={confirmMessage}
          confirm={this.handleConfirm}
          cancel={this.handleCancel}
        />
        <AudioComponent />
      </div>
    )
  }
}

PlayerHome.defaultProps = {
  addFiles: () => {},
  onUnload: () => {},
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
  onUnload: PropTypes.func,
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      lastModified: PropTypes.number,
      path: PropTypes.string
    })
  )
}
