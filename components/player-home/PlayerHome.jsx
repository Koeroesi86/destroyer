import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './PlayerHome.scss'

export default class PlayerHome extends Component {
  constructor (props) {
    super(props)

    this.handleDrop = this.handleDrop.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  componentDidMount () {
    if (this.upload) {
      this.upload.allowdirs = true
      this.upload.webkitdirectory = true
    }
  }

  handleDrop (event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer.files.length > 0) {
      this.props.addFiles(event.dataTransfer.files)
    }
  }

  handleFileChange (event) {
    event.stopPropagation()
    event.preventDefault()
    const { files } = event.target
    this.props.addFiles(files)
  }

  render () {
    return (
      <div
        className={style.PlayerHome}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        <div className={style.mainPanel}>
          <div className={style.controls}>
            Controls
          </div>
          <div className={style.library}>
            <div className={style.manageLibrary}>
              <div className={style.sectionTitle}>
                Folders
              </div>
              <div className={style.folders}>
                {this.props.folders.map(folder => (
                  <div
                    key={folder.path}
                    title={folder.lastModified}
                    className={style.folder}
                  >
                    {folder.path}
                  </div>
                ))}
                <div
                  className={style.addItems}
                  onClick={() => { this.upload.click() }}
                >
                  Drop music folders here
                  <input
                    type='file'
                    ref={ref => { this.upload = ref }}
                    className={style.fileInput}
                    multiple
                    onChange={this.handleFileChange}
                  />
                </div>
              </div>
            </div>
            <div className={style.collection}>
              {this.props.library.length === 0 && (
                <div>Library placeholder</div>
              )}
              {this.props.library.map(track => (
                <div key={track.path} className={style.album}>
                  <div
                    title={track.album}
                    className={style.cover}
                    style={{
                      backgroundImage: track.picture ? `url("${track.picture}")` : ''
                    }}
                  />
                  <div className={style.meta}>
                    <div>{track.artist}</div>
                    <div>{track.album}</div>
                    <div>{track.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={style.nowPlaying}>
          Now playing
        </div>
      </div>
    )
  }
}

PlayerHome.defaultProps = {
  addFiles: () => {},
  folders: [],
  library: []
}

PlayerHome.propTypes = {
  addFiles: PropTypes.func,
  folders: PropTypes.arrayOf(
    PropTypes.shape({
      lastModified: PropTypes.number,
      path: PropTypes.string
    })
  ),
  library: PropTypes.arrayOf(PropTypes.shape({
    album: PropTypes.string,
    artist: PropTypes.string,
    disk: PropTypes.string,
    duration: PropTypes.number,
    genre: PropTypes.string,
    path: PropTypes.string,
    picture: PropTypes.string,
    title: PropTypes.string,
    track: PropTypes.string,
    year: PropTypes.string
  }))
}
