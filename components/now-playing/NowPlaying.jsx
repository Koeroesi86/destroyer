import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import slugify from 'slugify'
import { trackType } from '../player-home/PlayerHome'
import style from './NowPlaying.scss'

function NowPlaying ({
  nowPlaying,
  currentSong,
  playTrack
}) {
  return (
    <div className={style.nowPlaying}>
      <div className={style.header}>Now playing</div>
      <div className={style.tracks}>
        {nowPlaying.map(track => (
          <div
            key={`now-playing-track-${slugify(track.path, { remove: /[*+~./()'",!:@\\]/g, lower: true })}`}
            className={classNames(style.track, {
              [style.current]: currentSong && track.path === currentSong.path
            })}
            onDoubleClick={() => playTrack(track)}
            title={`${track.track ? track.track + ' - ' : ''}${track.title}`}
          >
            {track.track && track.track + ' - '}
            {track.title}
          </div>
        ))}
      </div>
    </div>
  )
}

NowPlaying.defaultProps = {
  nowPlaying: [],
  currentSong: null,
  playTrack: () => {}
}

NowPlaying.propTypes = {
  nowPlaying: PropTypes.arrayOf(PropTypes.shape(trackType)),
  currentSong: PropTypes.shape(trackType),
  playTrack: PropTypes.func
}

export default NowPlaying
