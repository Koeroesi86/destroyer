import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { trackType } from '../player-home/PlayerHome'
import style from './TrackView.scss'
import TrackViewItem from '../track-view-item'

class TrackView extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      selectedTracks: [],
      tracks: this.props.tracks,
      scrolledTop: true
    }
    this.toggleTrack = this.toggleTrack.bind(this)
    this.doubleClickTrack = this.doubleClickTrack.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.updateTracks = _.debounce((tracks) => {
      this.setState({ tracks })
    }, 200)
  }

  componentDidMount () {
    if (this.listing) {
      this.listing.addEventListener('scroll', this.onScroll)
    }
  }

  componentWillUnmount () {
    if (this.listing) {
      this.listing.removeEventListener('scroll', this.onScroll)
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.tracks.length !== prevProps.tracks.length) {
      this.updateTracks(this.props.tracks)
    }
  }

  shouldComponentUpdate (prevProps, prevState) {
    if (this.state.scrolledTop !== prevState.scrolledTop) {
      return true
    }

    if (this.state.selectedTracks.length !== prevState.selectedTracks.length) {
      return true
    }

    if (this.props.currentSong !== prevProps.currentSong || this.props.playTracks !== prevProps.playTracks) {
      return true
    }

    if (JSON.stringify(this.props.tracks) !== JSON.stringify(prevProps.tracks)) {
      return true
    }

    if (JSON.stringify(this.state.tracks) !== JSON.stringify(prevState.tracks)) {
      return true
    }

    return false
  }

  onScroll (e) {
    const { scrollTop } = e.target
    if (scrollTop > 0) {
      if (this.state.scrolledTop) {
        this.setState({ scrolledTop: false })
      }
    } else {
      if (!this.state.scrolledTop) {
        this.setState({ scrolledTop: true })
      }
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
    const { currentSong, playTracks } = this.props
    const { selectedTracks, scrolledTop, tracks } = this.state
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
          className={classNames(style.separator, {
            [style.scrolled]: !scrolledTop
          })}
        />
        <div className={style.listing} ref={l => { this.listing = l }}>
          {tracks.map(track => (
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
