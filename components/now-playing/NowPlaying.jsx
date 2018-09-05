import React, { PureComponent } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import slugify from 'slugify'
import { trackType } from '../player-home/PlayerHome'
import style from './NowPlaying.scss'
import { basename } from 'path'
import { MdPlayArrow as PlayIcon } from 'react-icons/md'

class NowPlaying extends PureComponent {
  get coverStyle () {
    let {
      currentSong,
      port
    } = this.props
    const coverStyle = {}

    if (currentSong && currentSong.picture) {
      const cover = basename(currentSong.picture)
      coverStyle.backgroundImage = `url("http://localhost:${port}/albumart/${cover}")`
    }

    return coverStyle
  }

  render () {
    let {
      nowPlaying,
      currentSong,
      playTrack
    } = this.props
    return (
      <div className={style.nowPlaying}>
        <div className={style.header}>Now playing</div>
        <div className={style.contents}>
          {currentSong && <div className={style.currentSong}>
            <div
              className={style.cover}
              style={this.coverStyle}
            />
            <div className={style.meta}>
              <div className={style.title}>
                {currentSong.track ? (
                  <span className={style.trackNo}>#{currentSong.track}</span>
                ) : ''}
                {currentSong.title}
              </div>
              <div className={style.album}>
                {currentSong.album}
              </div>
              <div className={style.artist}>
                {currentSong.artist}
              </div>
            </div>
          </div>}
          <div className={style.tracks}>
            {nowPlaying.map(track => (
              <div
                key={`now-playing-track-${slugify(track.path, { remove: /[*+~./()'",!:@\\]/g, lower: true })}`}
                className={classNames(style.track, {
                  [style.current]: currentSong && track.path === currentSong.path
                })}
                onDoubleClick={() => playTrack(track)}
                title={`#${track.track ? track.track + ' ' : ''}${track.title}`}
              >
                <span
                  className={style.playButton}
                  onClick={() => playTrack(track)}
                >
                  <PlayIcon className={style.playIcon} size={'12px'} />
                </span>
                {track.track ? (
                  <span className={style.trackNo}>#{track.track}</span>
                ) : ''}
                {track.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

NowPlaying.defaultProps = {
  nowPlaying: [],
  port: '3000',
  currentSong: null,
  playTrack: () => {}
}

NowPlaying.propTypes = {
  nowPlaying: PropTypes.arrayOf(PropTypes.shape(trackType)),
  currentSong: PropTypes.shape(trackType),
  port: PropTypes.string,
  playTrack: PropTypes.func
}

export default NowPlaying
