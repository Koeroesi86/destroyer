import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { trackType } from '../player-home/PlayerHome'
import style from './AlbumViewThumbnail.scss'
import Time from '../time'

class AlbumViewThumbnail extends PureComponent {
  componentDidMount () {
    this.updateCover()
  }

  componentDidUpdate (prevProps) {
    if (this.props.album.cover !== prevProps.album.cover) {
      this.updateCover()
    }
  }

  updateCover () {
    const { album: { cover }, port } = this.props

    if (cover) {
      this.cover.style.backgroundImage = `url("http://localhost:${port}/local?path=${encodeURIComponent(cover)}")`
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
          <div className={classNames(style.duration)}>
            <Time seconds={album.duration} />
          </div>
        </div>
      </div>
    )
  }
}

AlbumViewThumbnail.defaultProps = {
  album: {},
  selectAlbum: () => {},
  playTracks: () => {},
  port: '3000'
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
  port: PropTypes.string,
  playTracks: PropTypes.func
}

export default AlbumViewThumbnail
