import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './Equalizer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

class Equalizer extends PureComponent {
  componentDidMount () {
    if (this.props.context && this.props.source) {
      this.setup()
    }
  }

  componentDidUpdate () {
    if (this.props.context && this.props.source) {
      this.setup()
    }
  }

  setup () {
    this.connectedBands = this.props.bands
      .map(band => {
        const currentBand = this.props.context.createBiquadFilter()

        if (band.type) {
          currentBand.type = band.type
        } else {
          currentBand.type = 'bandpass'
        }
        if (band.frequency) currentBand.frequency.value = band.frequency
        currentBand.gain.value = this.props.gainDb

        return currentBand
      })
      .map((band, index) => {
        this.props.source.connect(band)

        let invert
        if (index === 0 || index === this.props.bands.length - 1) {
          invert = this.props.context.createGain()
          invert.gain.value = -1.0
          band.connect(invert)
        }

        const gainContext = this.props.context.createGain()
        band.connect(gainContext)

        return {
          band,
          invert,
          gainContext
        }
      })

    this.connectedBands = this.connectedBands
      .map((connectedBand, index) => {
        if (index === 0 && index < this.props.bands.length - 1) {
          connectedBand.gainContext.connect(this.connectedBands[index + 1].band)
        }

        if (index > 1 && index === this.props.bands.length - 1) {
          connectedBand.gainContext.connect(this.connectedBands[index - 1].band)
        }

        return connectedBand
      })

    const sum = this.props.context.createGain()
    this.connectedBands = this.connectedBands
      .map(connectedBand => {
        connectedBand.gainContext.connect(sum)
        return connectedBand
      })
    sum.connect(this.props.context.destination)
  }

  changeGain (inputValue, index) {
    const connectedBand = this.connectedBands[index]
    const value = parseFloat(inputValue) / 100.0

    connectedBand.gainContext.gain.value = value
  }

  render () {
    return (
      <div className={classNames(style.equalizer, {
        [style.show]: this.props.show
      })}>
        <div className={style.header}>
          <div>Equalizer</div>
          <div
            className={style.close}
            onClick={this.props.close}
          >
            <FontAwesomeIcon icon={faTimes} size='sm' />
          </div>
        </div>
        <div className={style.sliders}>
          {this.props.bands.map((band, index) => (
            <div className={style.slider} key={index}>
              <input
                type='range'
                className={style.input}
                aria-orientation='vertical'
                onInput={e => { this.changeGain(e.target.value, index) }}
              />
              <div className={style.band}>
                {band.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

Equalizer.defaultProps = {
  show: true,
  source: null,
  gainDb: -40.0,
  close: () => {},
  bands: [
    {
      type: 'lowshelf',
      label: 'Bass',
      frequency: 80
    },
    {
      label: 'Mid'
    },
    {
      type: 'highpass',
      label: 'Treble',
      frequency: 3600
    }
  ]
}

Equalizer.propTypes = {
  show: PropTypes.bool,
  source: PropTypes.object,
  context: PropTypes.object,
  gainDb: PropTypes.number,
  close: PropTypes.func,
  bands: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']),
      label: PropTypes.string,
      frequency: PropTypes.number
    })
  )
}

export default Equalizer
