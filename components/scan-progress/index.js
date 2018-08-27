import ScanProgress from './ScanProgress'
import connect from 'react-redux/es/connect/connect'

const mapState = state => ({
  current: state.uiState.progress,
  total: state.uiState.totalCount,
  scanningFolder: state.uiState.scanningFolder // || '/d/Chris/Documents/Developement/electron-music-player/d/Chris/Documents/Developement/electron-music-player/d/Chris/Documents/Developement/electron-music-player'
})
const mapDispatch = dispatch => ({})

export default window
  ? connect(
      mapState,
      mapDispatch
    )(ScanProgress)
  : ScanProgress
