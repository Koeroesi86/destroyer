import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaSyncAlt } from 'react-icons/fa'
import AlbumView from '../album-view'
import TrackView from '../track-view'
import { trackType } from '../player-home/PlayerHome'
import style from './LocalCollection.scss'
import TitleBar from '../title-bar'
import FolderManagement from '../folder-management'

class LocalCollection extends PureComponent {
  constructor (props) {
    super(props)

    this.handleDrop = this.handleDrop.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  handleDrop (event) {
    event.preventDefault()
    event.stopPropagation()
    const { files } = event.dataTransfer

    this.props.addFiles(files)
  }

  handleFileChange (event) {
    event.stopPropagation()
    event.preventDefault()
    const { files } = event.target

    this.props.addFiles(files)
  }

  render () {
    const { view, setView, rescanLibrary, scanningFolder, tracks, addFiles } = this.props
    return (
      <div
        className={style.localCollection}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        <div className={style.viewControls}>
          <div
            className={classNames(style.view, {
              [style.current]: view === 'albums'
            })}
            onClick={() => setView('albums')}
          >
            Albums
          </div>
          <div
            className={classNames(style.view, {
              [style.current]: view === 'tracks'
            })}
            onClick={() => setView('tracks')}
          >
            Songs
          </div>
          <div
            className={classNames(style.view, {
              [style.current]: view === 'folders'
            })}
            onClick={() => setView('folders')}
          >
            Folders
          </div>
          <div className={style.libraryControls}>
            <button
              onClick={rescanLibrary}
              disabled={!!scanningFolder}
              className={classNames({
                [style.spinning]: scanningFolder
              })}
            >
              <FaSyncAlt />
              Rescan
            </button>
          </div>
        </div>
        <div className={style.viewPanels}>
          {tracks.length === 0 && false && (
            <div>Library placeholder</div>
          )}
          <div className={classNames(style.albums, {
            [style.active]: view === 'albums'
          })}>
            <AlbumView />
          </div>
          <div className={classNames(style.albums, {
            [style.active]: view === 'tracks'
          })}>
            <TrackView />
          </div>
          <div className={classNames(style.folders, {
            [style.active]: view === 'folders'
          })}>
            <FolderManagement handleFileChange={addFiles} />
          </div>
        </div>
      </div>
    )
  }
}

LocalCollection.defaultProps = {
  view: 'albums',
  setView: () => {},
  rescanLibrary: () => {},
  addFiles: () => {},
  scanningFolder: null,
  tracks: []
}

LocalCollection.propTypes = {
  view: PropTypes.string,
  setView: PropTypes.func,
  addFiles: PropTypes.func,
  rescanLibrary: PropTypes.func,
  scanningFolder: PropTypes.string,
  tracks: PropTypes.arrayOf(PropTypes.shape(trackType))
}

export default LocalCollection
