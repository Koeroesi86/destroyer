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
    const { albums } = this.state
    return (
      <div className={style.albums}>
        <div
          ref={s => { this.separator = s }}
          className={style.separator}
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
