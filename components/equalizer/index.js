import Equalizer from './Equalizer'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  show: state.uiState.showEqualizer
})

const mapDispatch = dispatch => ({
  close: () => dispatch({ type: 'CLOSE_EQUALIZER', payload: {} })
})

const ConnectedEqualizer = connect(
  mapState,
  mapDispatch
)(Equalizer)

ConnectedEqualizer.propTypes = Object.assign({}, Equalizer.propTypes)

export default ConnectedEqualizer
