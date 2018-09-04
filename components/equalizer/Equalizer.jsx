import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './Equalizer.scss'
import Slider from '../slider/Slider'

class Equalizer extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      connectedBands: null
    }
  }
  componentDidMount () {
    this.props.onAudioMounted(() => {
      this.setup()
    })
  }

  setup () {
    let connectedBands = this.props.bands
      .map(band => {
        const currentBand = this.props.createBiquadFilter()

        if (band.type) {
          currentBand.type = band.type
        } else {
          // currentBand.type = 'bandpass'
        }
        if (band.frequency) currentBand.frequency.value = band.frequency
        currentBand.gain.value = this.props.gainDb

        return currentBand
      })
      .map((band, index) => {
        this.props.connectToSource(band)

        let invert
        // if (index === 0 || index === this.props.bands.length - 1) {
        //   invert = this.props.createGain()
        //   invert.gain.value = -1.0
        //   band.connect(invert)
        // }

        const gainContext = this.props.createGain()
        band.connect(gainContext)

        return {
          band,
          invert,
          gainContext
        }
      })

    connectedBands = connectedBands
      .map((connectedBand, index) => {
        if (index === 0 && index < this.props.bands.length - 1) {
          connectedBand.gainContext.connect(connectedBands[index + 1].band)
        }

        if (index > 1 && index === this.props.bands.length - 1) {
          connectedBand.gainContext.connect(connectedBands[index - 1].band)
        }

        return connectedBand
      })

    const sum = this.props.createGain()
    connectedBands = connectedBands
      .map(connectedBand => {
        connectedBand.gainContext.connect(sum)
        return connectedBand
      })
    this.props.connectDestination(sum)
    this.setState({ connectedBands })
  }

  changeGain (inputValue, index) {
    this.setState(() => {
      const connectedBands = this.state.connectedBands.slice()
      const connectedBand = connectedBands[index]
      connectedBand.gainContext.gain.value = parseFloat(inputValue) / 100.0
      return { connectedBands }
    })
  }

  render () {
    const { connectedBands } = this.state
    return (
      <div className={style.equalizer}>
        <div className={style.header}>
          Equalizer
        </div>
        <div className={style.sliders}>
          {connectedBands && connectedBands.map((connectedBand, index) => (
            <div className={style.slider} key={index}>
              <div className={style.input}>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={connectedBand.gainContext.gain.value * 100}
                  orientation={'vertical'}
                  onInput={e => { this.changeGain(e.target.value, index) }}
                />
              </div>
              <div className={style.band}>
                {this.props.bands[index].label}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

Equalizer.defaultProps = {
  gainDb: -40.0,
  setGain: () => {},
  createBiquadFilter: () => {},
  createGain: () => {},
  connectDestination: () => {},
  connectToSource: () => {},
  onAudioMounted: () => {},
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
  gainDb: PropTypes.number,
  setGain: PropTypes.func,
  createBiquadFilter: PropTypes.func,
  createGain: PropTypes.func,
  connectDestination: PropTypes.func,
  connectToSource: PropTypes.func,
  onAudioMounted: PropTypes.func,
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
