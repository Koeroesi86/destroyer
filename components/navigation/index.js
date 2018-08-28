import connect from 'react-redux/es/connect/connect'
import Navigation from './Navigation.jsx'

const mapState = state => ({
  tab: state.uiState.tab
})
const mapDispatch = dispatch => ({
  setTab: (tab) => dispatch({ type: 'SET_TAB', payload: { tab } })
})

export default window
  ? connect(mapState, mapDispatch)(Navigation)
  : Navigation
