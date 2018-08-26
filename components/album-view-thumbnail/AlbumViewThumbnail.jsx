import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { formatTime, trackType } from '../player-home/PlayerHome'
import style from './AlbumViewThumbnail.scss'

function AlbumViewThumbnail ({
  album,
  selectAlbum,
  playTracks
}) {
  return (
    <div
      key={album.id}
      className={style.albumViewThumbnail}
      onClick={() => selectAlbum(album)}
      onDoubleClick={() => playTracks(album.tracks)}
      onTouchEnd={() => playTracks(album.tracks)}
    >
      <div
        title={album.title}
        className={style.cover}
        style={{
          backgroundImage: album.cover ? `url("${album.cover}")` : ''
        }}>
        <div className={style.overlay}>
          <div
            className={classNames(style.metaData, style.icon)}
            onClick={e => {
              e.stopPropagation()
              playTracks(album.tracks)
            }}
          >
            <FontAwesomeIcon icon={faPlay} size='sm' />
          </div>
        </div>
      </div>
      <div className={style.meta}>
        <div className={classNames(style.title)} title={album.title}>{album.title}</div>
        <div className={classNames(style.artist)} title={album.artist}>{album.artist}</div>
        <div className={classNames(style.duration)} title={formatTime(album.duration)}>{formatTime(album.duration)}</div>
      </div>
    </div>
  )
}

AlbumViewThumbnail.defaultProps = {
  album: {},
  selectAlbum: () => {},
  playTracks: () => {}
}

AlbumViewThumbnail.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.string,
    artist: PropTypes.string,
    title: PropTypes.string,
    cover: PropTypes.string,
    duration: PropTypes.number,
    tracks: PropTypes.arrayOf(PropTypes.shape(trackType))
  }),
  selectAlbum: PropTypes.func,
  playTracks: PropTypes.func
}

export default AlbumViewThumbnail
