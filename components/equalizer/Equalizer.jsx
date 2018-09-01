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

  componentDidUpdate (prevProps) {
    if (this.props.context !== prevProps.context || this.props.source !== prevProps.source) {
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
    connectedBand.gainContext.gain.value = parseFloat(inputValue) / 100.0
  }

  render () {
    return (
      <div className={style.equalizer}>
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

Equalizer.defaultProps = {// 70, 180, 320, 600, 1000, 3000, 6000, 12000, 14000, 16000
  show: true,
  source: null,
  gainDb: -40.0,
  close: () => {},
  bands: [
    {
      type: 'lowshelf',
      label: '70',
      frequency: 70
    },
    {
      label: '180',
      frequency: 180
    },
    {
      label: '320',
      frequency: 320
    },
    {
      label: '600',
      frequency: 600
    },
    {
      label: '1k',
      frequency: 1000
    },
    {
      label: '3k',
      frequency: 3000
    },
    {
      label: '6k',
      frequency: 6000
    },
    {
      label: '12k',
      frequency: 12000
    },
    {
      label: '14k',
      frequency: 14000
    },
    {
      type: 'highpass',
      label: '16k',
      frequency: 16000
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
