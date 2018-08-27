import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import style from './ScanProgress.scss'
import { shell } from 'electron'

const Progress = ({ current = 0, total = 0 }) => (
  <span className={style.progress}>file #{current} of #{total} ({!total ? 0 : (((current / total) * 1000) / 10).toFixed(1)}%)</span>
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
      <ScanningLabel />
      <ScanningFolder scanningFolder={scanningFolder} />
      <Progress current={current} total={total} />
    </div>
  )
}

ScanProgress.propTypes = {
  scanningFolder: PropTypes.string,
  current: PropTypes.number,
  total: PropTypes.number
}

export default ScanProgress
