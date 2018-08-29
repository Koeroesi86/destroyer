import React, { Fragment } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

function Time ({ seconds }) {
  return (
    <span>
      {moment(Math.floor(parseFloat(seconds) * 1000), 'x', true).format('HH:mm:ss')}
    </span>
  )
}

Time.propTypes = {
  seconds: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default Time
