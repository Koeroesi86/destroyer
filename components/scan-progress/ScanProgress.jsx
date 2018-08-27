import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './ScanProgress.scss'
import { shell } from 'electron'

const Progress = ({ current = 0, total = 0 }) => (
  <span className={style.progress}>
    <span>file&nbsp;#</span>
    <span>{current}</span>
    <span>&nbsp;of&nbsp;#</span>
    <span>{total}</span>
    <span>&nbsp;</span>
    <span>({!total ? 0 : Math.floor(current / total) * 100}%)</span>
  </span>
)

Progress.propTypes = {
  current: PropTypes.number,
  total: PropTypes.number
}

const ScanningFolder = ({ scanningFolder }) => (
  <span
    onClick={() => shell.openItem(scanningFolder)}
    title={`Click to open ${scanningFolder}`}
    className={style.link}
  >{scanningFolder}</span>
)

ScanningFolder.propTypes = {
  scanningFolder: PropTypes.string
}

const ScanningLabel = () => (
  <span className={style.pre}>Currently scanning:</span>
)

function ScanProgress ({
  scanningFolder,
  current = 0,
  total = 0
}) {
  return (
    <div
      className={classNames(style.scanProgress, {
        [style.scanning]: scanningFolder
      })}
    >
      <div className={style.container}>
        <ScanningLabel />
        <ScanningFolder scanningFolder={scanningFolder} />
        <Progress current={current} total={total} />
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
