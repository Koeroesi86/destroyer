import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import style from './FolderManagement.scss'

class FolderManagement extends PureComponent {
  componentDidMount () {
    if (this.upload) {
      this.upload.allowdirs = true
      this.upload.webkitdirectory = true
    }
  }

  render () {
    const { folders, handleFileChange } = this.props
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
              onChange={handleFileChange}
            />
          </div>
        </div>
      </section>
    )
  }
}

FolderManagement.defaultProps = {
  folders: [],
  handleFileChange: () => {}
}

FolderManagement.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.shape({})),
  handleFileChange: PropTypes.func
}

export default FolderManagement

