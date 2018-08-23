import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { formatTime, trackType } from '../player-home/PlayerHome'
import style from './TrackView.scss'
import { debounce } from 'lodash'

class TrackView extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      selectedTracks: [],
      tracks: []
    }

    this.update = debounce(() => {
      this.setState({
        tracks: this.props.tracks
      })
    }, 200)
  }

  componentDidUpdate (prevProps) {
    if (JSON.stringify(prevProps.tracks) !== JSON.stringify(this.props.tracks)) {
      this.update()
    }
  }

  toggleTrack (track) {
    if (!this.state.selectedTracks.includes(track)) {
      const selectedTracks = this.state.selectedTracks.slice()
      selectedTracks.push(track)
      this.setState({
        selectedTracks
      })
    } else {
      const selectedTracks = this.state.selectedTracks.slice()
      const index = selectedTracks.indexOf(track)
      selectedTracks.splice(index, 1)
      this.setState({
        selectedTracks
      })
    }
  }

  doubleClickTrack (track) {
    const selectedTracks = [track]
    this.props.playTracks(selectedTracks)
    this.setState({
      selectedTracks
    })
  }

  render () {
    const { tracks, currentSong, playTracks } = this.props
    const { selectedTracks } = this.state
    return (
      <div className={style.tracks}>
        <div
          className={classNames(style.track, style.header)}
        >
          <div className={classNames(style.field, style.duration)}>Duration</div>
          <div className={classNames(style.field, style.artist)}>Artist</div>
          <div className={classNames(style.field, style.year)}>Year</div>
          <div className={classNames(style.field, style.album)}>Album</div>
          <div className={classNames(style.field, style.trackNo)}>#</div>
          <div className={classNames(style.field, style.title)}>Title</div>
        </div>
        <div className={style.listing}>
          {tracks.map(track => (
            <div
              key={track.path}
              className={classNames(style.track, {
                [style.selected]: selectedTracks.includes(track),
                [style.current]: currentSong && currentSong.path === track.path
              })}
              onClick={() => this.toggleTrack(track)}
              onDoubleClick={() => this.doubleClickTrack(track)}
            >
              <div className={classNames(style.field, style.duration)}>{formatTime(track.duration)}</div>
              <div className={classNames(style.field, style.artist)}>{track.artist}</div>
              <div className={classNames(style.field, style.year)}>{track.year || '-'}</div>
              <div className={classNames(style.field, style.album)}>{track.album || '-'}</div>
              <div className={classNames(style.field, style.trackNo)}>{track.track || '-'}</div>
              <div className={classNames(style.field, style.title)}><div>{track.title || '-'}</div></div>
            </div>
          ))}
        </div>
        <div className={style.controls}>
          <button onClick={() => { this.setState({ selectedTracks: [] }) }}>
            Clear selection
          </button>
          <button onClick={() => { this.setState({ selectedTracks: tracks }) }}>
            Select All
          </button>
          <button onClick={() => { playTracks(selectedTracks) }}>
            Play selected
          </button>
        </div>
      </div>
    )
  }
}

TrackView.defaultProps = {
  tracks: [],
  show: true,
  playTracks: () => {}
}

TrackView.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape(trackType)),
  currentSong: PropTypes.shape(trackType),
  show: PropTypes.bool,
  playTracks: PropTypes.func
}

export default TrackView
