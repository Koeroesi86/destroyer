const { walk } = require('walk')
const musicMetadata = require('musicmetadata')
const fs = require('fs')
const dateFns = require('date-fns')

/** @returns {Promise} */
function scanFolder (currentPath) {
  return new Promise((resolve, reject) => {
    const tracks = []
    const directory = walk(currentPath, { followLinks: false })
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
            if (metadata.picture.length > 0) {
              const picture = metadata.picture[0]
              metadata.picture = `data:image/${picture.format};base64, ${picture.data.toString('base64')}`
            }
            tracks.push(metadata)
            readStream.close()
          }
        })
        readStream.on('close', () => {
          // next()
        })
      }
      next()
    })
    directory.on('end', () => {
      resolve(tracks)
    })
  })
}

module.exports = scanFolder
