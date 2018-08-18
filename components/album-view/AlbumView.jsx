import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import style from './AlbumView.scss'
import { formatTime } from '../player-home/PlayerHome'

function AlbumView ({ albums, playAlbum }) {
  return (
    <div className={style.albums}>
      {albums.map(album => (
        <div
          key={album.id}
          className={style.album}
          onDoubleClick={() => playAlbum(album)}
          onTouchEnd={() => playAlbum(album)}
        >
          <div
            title={album.title}
            className={style.cover}
            style={{
              backgroundImage: album.cover ? `url("${album.cover}")` : ''
            }}
          />
          <div className={style.meta}>
            <div className={style.metaData}>{album.artist}</div>
            <div className={style.metaData}>{album.title}</div>
            <div className={style.metaData}>{formatTime(album.duration)}</div>
            <div
              className={classNames(style.metaData, style.icon)}
              onClick={() => playAlbum(album)}
            >
              <FontAwesomeIcon icon={faPlay} size='sm' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

AlbumView.defaultProps = {
  playAlbum: () => {},
  albums: []
}

AlbumView.propTypes = {
  playAlbum: PropTypes.func,
  albums: PropTypes.arrayOf(PropTypes.shape())
}

export default AlbumView
