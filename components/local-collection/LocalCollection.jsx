import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import AlbumView from '../album-view'
import TrackView from '../track-view'
import { trackType } from '../player-home/PlayerHome'
import style from './LocalCollection.scss'

class LocalCollection extends PureComponent {
  render () {
    const { view, setView, rescanLibrary, scanningFolder, tracks } = this.props
    return (
      <div className={style.localCollection}>
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
          <div className={style.libraryControls}>
            <button
              onClick={rescanLibrary}
              disabled={!!scanningFolder}
              className={classNames({
                [style.spinning]: scanningFolder
              })}
            >
              <FontAwesomeIcon icon={faSyncAlt} size='sm' />
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
        </div>
      </div>
    )
  }
}

LocalCollection.defaultProps = {
  view: 'albums',
  setView: () => {},
  rescanLibrary: () => {},
  scanningFolder: null,
  tracks: []
}

LocalCollection.propTypes = {
  view: PropTypes.string,
  setView: PropTypes.func,
  rescanLibrary: PropTypes.func,
  scanningFolder: PropTypes.string,
  tracks: PropTypes.arrayOf(PropTypes.shape(trackType))
}

export default LocalCollection
