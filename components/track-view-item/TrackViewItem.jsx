import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { formatTime, trackType } from '../player-home/PlayerHome'
import style from './TrackViewItem.scss'

const TrackViewItemField = ({ onClick = () => {}, className = '', children = null }) => (
  <div
    className={classNames(style.field, className)}
    onClick={onClick}
  >
    {children}
  </div>
)

TrackViewItemField.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
}

function TrackViewItem ({ track, isSelected, isCurrent, isHeader, clickTrack, doubleClickTrack }) {
  return (
    <div
      className={classNames(style.trackViewItem, {
        [style.header]: isHeader,
        [style.selected]: isSelected,
        [style.current]: isCurrent
      })}
      onClick={() => clickTrack(track)}
      onDoubleClick={() => doubleClickTrack(track)}
    >
      <TrackViewItemField className={style.duration}>{isNaN(track.duration) ? track.duration : formatTime(track.duration)}</TrackViewItemField>
      <TrackViewItemField className={style.artist}>{track.artist || '-'}</TrackViewItemField>
      <TrackViewItemField className={style.year}>{track.year || '-'}</TrackViewItemField>
      <TrackViewItemField className={style.album}>{track.album || '-'}</TrackViewItemField>
      <TrackViewItemField className={style.trackNo}>{track.track || '-'}</TrackViewItemField>
      <TrackViewItemField className={style.title}><div>{track.title || '-'}</div></TrackViewItemField>
    </div>
  )
}

TrackViewItem.defaultProps = {
  track: {},
  isHeader: false,
  isSelected: false,
  isCurrent: false,
  clickTrack: () => {},
  doubleClickTrack: () => {}
}

TrackViewItem.propTypes = {
  track: PropTypes.shape(trackType),
  isHeader: PropTypes.bool,
  isSelected: PropTypes.bool,
  isCurrent: PropTypes.bool,
  clickTrack: PropTypes.func,
  doubleClickTrack: PropTypes.func
}

export default TrackViewItem
