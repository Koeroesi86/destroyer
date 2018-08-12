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
            <div
              className={style.addItems}
              onClick={() => { this.upload.click() }}
            >
              Drop music collection here
              <input
                type='file'
                ref={ref => { this.upload = ref }}
                className={style.fileInput}
                multiple
                onChange={this.handleFileChange}
              />
            </div>
            <div>
              Library placeholder
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
  addFiles: () => {}
}

PlayerHome.propTypes = {
  addFiles: PropTypes.func
}
