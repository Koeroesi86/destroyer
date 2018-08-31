import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './ScanProgress.scss'
import { shell } from 'electron'

function ScanProgress ({
  scanningFolder,
  current = 0,
  total = 0
}) {
  return (
    <div
      className={classNames(style.scanProgress, {
        [style.scanning]: !!scanningFolder
      })}
    >
      <div className={style.container}>
        <span className={style.pre}>Currently scanning:</span>
        <span
          onClick={() => shell.openItem(scanningFolder)}
          title={`Click to open ${scanningFolder}`}
          className={style.link}
        >{scanningFolder}</span>
        <span className={style.progress}>
          file&nbsp;#{current}&nbsp;of&nbsp;#{total}&nbsp;({(total > 0 ? (Math.floor(current / total) * 100) : 0)}%)
        </span>
      </div>
    </div>
  )
}

ScanProgress.propTypes = {
  scanningFolder: PropTypes.string,
  current: PropTypes.number,
  total: PropTypes.number
}

export default ScanProgress
