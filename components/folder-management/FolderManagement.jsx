import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import style from './FolderManagement.scss'

class FolderManagement extends PureComponent {
  constructor (props) {
    super(props)

    this.handleFileChange = this.handleFileChange.bind(this)
  }

  componentDidMount () {
    if (this.upload) {
      this.upload.allowdirs = true
      this.upload.webkitdirectory = true
    }
  }

  handleFileChange (event) {
    event.stopPropagation()
    event.preventDefault()
    const { files } = event.target

    this.props.addFiles(files)
  }

  render () {
    const { folders, addFiles } = this.props
    return (
      <section className={style.folderManagement}>
        <div className={style.sectionTitle}>
          Folders
        </div>
        <div className={style.folders}>
          {folders.map(folder => (
            <div
              key={`folder-${folder.path}`}
              className={style.folder}
              title={folder.path}
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
              onChange={addFiles}
            />
          </div>
        </div>
      </section>
    )
  }
}

FolderManagement.defaultProps = {
  folders: [],
  addFiles: () => {}
}

FolderManagement.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.shape({})),
  addFiles: PropTypes.func
}

export default FolderManagement

