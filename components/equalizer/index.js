import Equalizer from './Equalizer'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  show: state.uiState.showEqualizer
})

const mapDispatch = dispatch => ({
  close: () => dispatch({ type: 'CLOSE_EQUALIZER', payload: {} })
})

export default window ? connect(mapState, mapDispatch)(Equalizer) : Equalizer
