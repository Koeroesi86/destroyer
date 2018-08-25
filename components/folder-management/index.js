import connect from 'react-redux/es/connect/connect'
import FolderManagement from './FolderManagement'

const mapState = state => ({
  folders: state.folders
})

const mapDispatch = dispatch => ({})

const ConnectedFolderManagement = connect(
  mapState,
  mapDispatch
)(FolderManagement)

ConnectedFolderManagement.propTypes = Object.assign({}, FolderManagement.propTypes)

export default ConnectedFolderManagement
