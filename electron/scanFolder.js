const walk = require('walk')
const musicMetadata = require('musicmetadata')
const fs = require('fs')
const dateFns = require('date-fns')

/** @returns {Promise} */
function scanFolder (currentPath) {
  const tracks = []
  return new Promise((resolve, reject) => {
    // console.log('currentPath', currentPath)
    const directory = walk.walk(currentPath, { followLinks: false })
    directory.on('file', (root, fileStats, next) => {
      let fileName = root + '/' + fileStats.name
      if (
        ['flac', 'm4a', 'mp3', 'mp4', 'aac'].indexOf(
          fileName.split('.').pop()
        ) > -1
      ) {
        let readStream = fs.createReadStream(fileName)
        musicMetadata(readStream, (error, metadata) => {
          if (error) {
            reject(error)
          } else {
            metadata.artist = metadata.artist[0] || ''
            metadata.title = metadata.title || ''
            metadata.album = metadata.album || ''
            metadata.root = root
            metadata.path = fileName
            metadata.time =
              Number(
                dateFns.format(new Date(fileStats.ctime), 'YYYYMMDDmm')
              ) * -1
            tracks.push(metadata)
            // store.dispatch({
            //   type: 'SCANNING',
            //   message: 'SCANNING: ' + metadata.artist + ' - ' + metadata.album
            // })
            readStream.close()
          }
        })
        readStream.on('close', () => {
          // next()
        })
      }
      // else if (
      //   fileStats.name.indexOf('.jpg') > 0 ||
      //   fileStats.name.indexOf('.png') > 0
      // ) {
      //   this.covers.push(fileName)
      // }
      next()
    })
    directory.on('end', () => {
      resolve(tracks)
    })
  })
}

module.exports = scanFolder
