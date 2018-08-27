import ScanProgress from './ScanProgress'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  current: state.uiState.progress,
  total: state.uiState.totalCount,
  scanningFolder: state.uiState.scanningFolder // || '/d/Chris/Documents/Developement/electron-music-player/d/Chris/Documents/Developement/electron-music-player/d/Chris/Documents/Developement/electron-music-player'
})
const mapDispatch = dispatch => ({})

const ConnectedScanProgress = connect(
  mapState,
  mapDispatch
)(ScanProgress)

ConnectedScanProgress.propTypes = Object.assign({}, ScanProgress.propTypes)

export default ConnectedScanProgress
