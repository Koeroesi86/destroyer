import connect from 'react-redux/es/connect/connect'
import PlayerHome from './PlayerHome.jsx'

const mapState = state => ({
  library: state.library,
  folders: state.folders
})
const mapDispatch = dispatch => ({
  /** @param {FileList} fileList */
  addFiles: (fileList) => dispatch({ type: 'FILES_ADDED', payload: { fileList } })
})

const ConnectedPlayerHome = connect(
  mapState,
  mapDispatch
)(PlayerHome)

export default ConnectedPlayerHome
