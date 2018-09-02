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
    const { max, value, orientation } = this.props
    if (this.slider.value !== value) {
      this.slider.value = value
      if (orientation !== 'vertical') {
        this.lowerFill.style.width = `${max > 0 ? (value / max) * 100 : 0}%`
      } else {
        this.lowerFill.style.height = `${max > 0 ? (value / max) * 100 : 0}%`
      }
    }
  }

  render () {
    const {
      min,
      max,
      step,
      orientation,
      onInput,
      onChange
    } = this.props
    return (
      <div className={classNames(style.slider, {
        [style.vertical]: orientation === 'vertical'
      })}>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          // value={value}
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
  orientation: 'horizontal',
  onChange: () => {}
}

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  orientation: PropTypes.string,
  value: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
  onChange: PropTypes.func
}

export default Slider
