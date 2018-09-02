import Equalizer from './Equalizer'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  show: state.uiState.showEqualizer,
  // bands: state.uiState.equalizer
})

const mapDispatch = dispatch => ({
  // changeGain: (value, index) => dispatch({ type: 'SET_GAIN', payload: { value, index } })
})

export default window ? connect(mapState, mapDispatch)(Equalizer) : Equalizer
