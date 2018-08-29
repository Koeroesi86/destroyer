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
      scrolledTop: true,
      albums: []
    }
    this.onScroll = _.debounce((e) => {
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
    }, 200)
    this.updateAlbums = _.debounce(() => {
      this.setState({
        albums: this.props.albums
      })
    }, 50)
  }

  componentDidUpdate (prevProps) {
    if (this.props.albums !== prevProps.albums) {
      this.updateAlbums()
    }
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

  render () {
    const { playTracks, selectAlbum } = this.props
    const { scrolledTop, albums } = this.state
    return (
      <div className={style.albums}>
        <div
          className={classNames(style.separator, {
            [style.scrolled]: !scrolledTop
          })}
        />
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
