import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { trackType } from '../player-home/PlayerHome'
import style from './TrackView.scss'
import TrackViewItem from '../track-view-item'

class TrackView extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      selectedTracks: []
    }
    this.toggleTrack = this.toggleTrack.bind(this)
    this.doubleClickTrack = this.doubleClickTrack.bind(this)
    this.onScroll = _.debounce((e) => {
      const { scrollTop } = e.target
      const { classList } = this.separator

      if (scrollTop > 0) {
        if (!classList.contains(style.scrolled)) {
          classList.add(style.scrolled)
        }
      } else {
        if (classList.contains(style.scrolled)) {
          classList.remove(style.scrolled)
        }
      }
    }, 50)
  }

  componentDidMount () {
    if (this.listing) {
      this.listing.addEventListener('scroll', this.onScroll, { passive: true })
    }
  }

  componentWillUnmount () {
    if (this.listing) {
      this.listing.removeEventListener('scroll', this.onScroll, { passive: true })
    }
  }

  toggleTrack (track) {
    const prevSelectedTracks = this.state.selectedTracks.slice(0)
    if (!prevSelectedTracks.includes(track)) {
      prevSelectedTracks.push(track)
      this.setState({
        selectedTracks: prevSelectedTracks
      })
    } else {
      const index = prevSelectedTracks.indexOf(track)
      prevSelectedTracks.splice(index, 1)
      this.setState({
        selectedTracks: prevSelectedTracks
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
    const { currentSong, playTracks, tracks, loaded } = this.props
    const { selectedTracks } = this.state
    const headerLabels = {
      duration: 'Duration',
      artist: 'Artist',
      year: 'Year',
      album: 'Album',
      track: '#',
      title: 'Title'
    }
    return (
      <div className={style.tracks}>
        <TrackViewItem
          track={headerLabels}
          isHeader
        />
        <div
          ref={s => { this.separator = s }}
          className={style.separator}
        />
        <div className={style.listing} ref={l => { this.listing = l }}>
          {loaded && tracks.map(track => (
            <TrackViewItem
              key={track.path}
              track={track}
              isSelected={selectedTracks.includes(track)}
              isCurrent={currentSong && currentSong.path === track.path}
              clickTrack={this.toggleTrack}
              doubleClickTrack={this.doubleClickTrack}
            />
          ))}
        </div>
        <div className={style.controls}>
          <button
            onClick={() => { this.setState({ selectedTracks: [] }) }}
          >
            Clear selection
          </button>
          <button
            onClick={() => { this.setState({ selectedTracks: tracks }) }}
          >
            Select All
          </button>
          <button
            onClick={() => { playTracks(selectedTracks) }}
          >
            Play selected
          </button>
        </div>
      </div>
    )
  }
}

TrackView.defaultProps = {
  tracks: [],
  playTracks: () => {},
  loaded: true
}

TrackView.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape(trackType)),
  currentSong: PropTypes.shape(trackType),
  loaded: PropTypes.bool,
  playTracks: PropTypes.func
}

export default TrackView
