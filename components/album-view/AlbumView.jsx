import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './AlbumView.scss'
import AlbumViewThumbnail from '../album-view-thumbnail'
import _ from 'lodash'

class AlbumView extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      albums: this.props.albums,
      scrolledTop: true,
      loaded: false
    }

    this.updateAlbums = _.debounce(() => {
      this.setState({
        albums: this.props.albums
      })
      if (!this.state.loaded) {
        setTimeout(() => {
          this.setState({ loaded: true })
        }, 500)
      }
    }, 200)
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (this.props.albums.length !== prevProps.albums.length) {
      this.updateAlbums()
    }
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

  render () {
    const { playTracks, selectAlbum } = this.props
    const { albums, scrolledTop, loaded } = this.state
    return (
      <div className={classNames(style.albums, {
        [style.loaded]: loaded
      })}>
        <div
          className={classNames(style.separator, {
            [style.scrolled]: !scrolledTop
          })}
        />
        <div className={style.loadingContainer}>
          Loading library...
        </div>
        <div
          className={style.listing}
          ref={l => { this.listing = l }}
        >
          {albums.map(album => (
            <AlbumViewThumbnail
              key={album.id}
              album={album}
              selectAlbum={selectAlbum}
              playTracks={playTracks}
            />
          ))}
        </div>
      </div>
    )
  }
}

AlbumView.defaultProps = {
  playTracks: () => {},
  selectAlbum: () => {},
  albums: []
}

AlbumView.propTypes = {
  playTracks: PropTypes.func,
  selectAlbum: PropTypes.func,
  albums: PropTypes.arrayOf(PropTypes.shape())
}

export default AlbumView
