import connect from 'react-redux/es/connect/connect'
import FolderManagement from './FolderManagement'

const mapState = state => ({
  folders: state.folders
})

const mapDispatch = dispatch => ({})

export default window
  ? connect(mapState, mapDispatch)(FolderManagement)
  : FolderManagement
