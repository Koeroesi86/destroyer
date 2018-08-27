import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'
import { formatTime, trackType } from '../player-home/PlayerHome'
import style from './AlbumViewThumbnail.scss'

class AlbumViewThumbnail extends PureComponent {
  shouldComponentUpdate (prevProps) {
    if (this.props.playTracks !== prevProps.playTracks) return true
    if (this.props.selectAlbum !== prevProps.selectAlbum) return true
    if (!_.isEqual(this.props.album, prevProps.album)) return true

    return false
  }

  componentDidMount () {
    this.updateCover()
  }

  componentDidUpdate (prevProps) {
    if (this.props.album.cover !== prevProps.album.cover) {
      this.updateCover()
    }
  }

  updateCover () {
    const { album: { cover } } = this.props

    if (cover) {
      this.cover.style.backgroundImage = `url("${cover}")`
    }
  }

  render () {
    let {
      album,
      selectAlbum,
      playTracks
    } = this.props
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
          ref={c => { this.cover = c }}
        >
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
          <div className={classNames(style.duration)} title={formatTime(album.duration)}>
            {formatTime(album.duration)}
          </div>
        </div>
      </div>
    )
  }
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
