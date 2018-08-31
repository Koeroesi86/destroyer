import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { faPlay, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from './AlbumDetails.scss'
import { trackType } from '../player-home/PlayerHome'
import Time from '../time'

class AlbumDetails extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      album: props.album
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.album !== prevProps.album) {
      if (!this.props.album) {
        setTimeout(() => {
          this.updateDisplayed()
        }, 2)
      } else {
        this.updateDisplayed()
      }
    }
  }

  updateDisplayed () {
    this.setState({ album: this.props.album })
  }

  render () {
    let {
      playTracks,
      close,
      port
    } = this.props
    const { album } = this.state
    const displayed = Object.assign({}, album)
    return (
      <div className={classNames(style.albumDetails, {
        [style.hasAlbum]: this.props.album
      })}>
        <div
          className={style.close}
          onClick={close}
        >
          <FontAwesomeIcon icon={faTimes} size='lg' />
        </div>
        <div
          className={style.cover}
          style={{ backgroundImage: displayed.cover ? `url("http://localhost:${port}/local?path=${encodeURIComponent(displayed.cover)}")` : '' }}
        />
        <div className={style.artist}>{displayed.artist}</div>
        <div className={style.title}>{displayed.title}</div>
        <div className={style.meta}>
          <div className={style.year}>{displayed.year}</div>
          <div className={style.duration}><Time seconds={displayed.duration} /></div>
        </div>
        <div className={style.tracks}>
          {displayed.tracks && displayed.tracks.map(track => (
            <div
              key={track.path}
              className={style.track}
            >
              {track.track && track.track + ' - '}
              {track.title}
            </div>
          ))}
        </div>
        <div
          className={style.playAlbum}
          onClick={() => playTracks(displayed.tracks)}
        >
          <FontAwesomeIcon icon={faPlay} size='sm' />
          <span className={style.label}>Play album</span>
        </div>
      </div>
    )
  }
}

AlbumDetails.defaultProps = {
  playTracks: () => {},
  close: () => {},
  port: '3000'
}

AlbumDetails.propTypes = {
  album: PropTypes.shape({
    artist: PropTypes.string,
    cover: PropTypes.string,
    duration: PropTypes.number,
    id: PropTypes.string,
    title: PropTypes.string,
    tracks: PropTypes.arrayOf(PropTypes.shape(trackType)),
    year: PropTypes.string
  }),
  playTracks: PropTypes.func,
  port: PropTypes.string,
  close: PropTypes.func
}

export default AlbumDetails
