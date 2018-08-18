import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import style from './Slider.scss'

class Slider extends PureComponent {
  componentDidMount () {
    if (this.slider && this.lowerFill) {
      this.update()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.slider && this.lowerFill && prevProps.value !== this.props.value) {
      this.update()
    }
  }

  update () {
    const { max, value } = this.props
    if (this.slider.value !== value) {
      this.slider.value = value
      this.lowerFill.style.width = `${(value / max) * 100}%`
    }
  }

  render () {
    const {
      min,
      max,
      step,
      value,
      onInput,
      onChange
    } = this.props
    return (
      <div className={classNames(style.slider)}>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          className={classNames(style.range)}
          onInput={onInput}
          onChange={onChange}
          ref={s => { this.slider = s }}
      />
        <div
          className={classNames(style.lowerFill)}
          ref={s => { this.lowerFill = s }}
      />
      </div>
    )
  }
}

Slider.defaultProps = {
  min: 0,
  max: 1,
  step: 0.01,
  onChange: () => {}
}

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
  onChange: PropTypes.func
}

export default Slider
