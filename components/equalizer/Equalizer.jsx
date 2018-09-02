import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './Equalizer.scss'
import Slider from '../slider/Slider'

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
        // if (index === 0 || index === this.props.bands.length - 1) {
        //   invert = this.props.context.createGain()
        //   invert.gain.value = -1.0
        //   band.connect(invert)
        // }

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
          Equalizer
        </div>
        <div className={style.sliders}>
          {this.props.bands.map((band, index) => (
            <div className={style.slider} key={index}>
              <div className={style.input}>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={50}
                  orientation={'vertical'}
                  onInput={e => { this.changeGain(e.target.value, index) }}
                />
              </div>
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
  setGain: () => {},
  close: () => {},
  bands: [
    {
      type: 'lowpass',
      label: '70',
      value: 0,
      frequency: 70
    },
    {
      label: '180',
      value: 0,
      frequency: 180
    },
    {
      label: '320',
      value: 0,
      frequency: 320
    },
    {
      label: '600',
      value: 0,
      frequency: 600
    },
    {
      label: '1k',
      value: 0,
      frequency: 1000
    },
    {
      label: '3k',
      value: 0,
      frequency: 3000
    },
    {
      label: '6k',
      value: 0,
      frequency: 6000
    },
    {
      label: '12k',
      value: 0,
      frequency: 12000
    },
    {
      label: '14k',
      value: 0,
      frequency: 14000
    },
    {
      type: 'highpass',
      label: '16k',
      value: 0,
      frequency: 16000
    }
  ]
}

Equalizer.propTypes = {
  source: PropTypes.object,
  context: PropTypes.object,
  gainDb: PropTypes.number,
  setGain: PropTypes.func,
  bands: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']),
      label: PropTypes.string,
      // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      frequency: PropTypes.number
    })
  )
}

export default Equalizer
