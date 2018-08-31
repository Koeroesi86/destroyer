import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import style from './AlbumView.scss'
import AlbumViewThumbnail from '../album-view-thumbnail'
import _ from 'lodash'

class AlbumView extends PureComponent {
  constructor (props) {
    super(props)

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

  render () {
    const { playTracks, selectAlbum, loaded, albums } = this.props
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
          {loaded && albums.map(album => (
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
  albums: [],
  loaded: true
}

AlbumView.propTypes = {
  loaded: PropTypes.bool,
  playTracks: PropTypes.func,
  selectAlbum: PropTypes.func,
  albums: PropTypes.arrayOf(PropTypes.shape())
}

export default AlbumView
