const { walk } = require('walk')
const musicMetadata = require('musicmetadata')
const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')
const addTrack = require('./addTrack')

const supportedFormats = ['flac', 'm4a', 'mp3', 'mp4', 'aac']

const parsePicture = picture => `data:image/${picture.format};base64, ${picture.data.toString('base64')}`
const formatTime = time => Number(dateFns.format(new Date(time), 'YYYYMMDDmm')) * -1
const scannedFolders = []

/** @returns {Promise} */
function scanFolder (database, currentPath, sender) {
  return new Promise((resolve, reject) => {
    const tracks = []
    sender.send('SCANNING_FOLDER', { folder: currentPath })
    const directory = walk(currentPath, { followLinks: false })
    directory.on('file', (root, fileStats, next) => {
      const fileName = path.join(root, '/' + fileStats.name)
      if (
        supportedFormats.includes(path.extname(fileName).replace('.', ''))
      ) {
        try {
          let readStream = fs.createReadStream(fileName)
          const writeMeta = metadata => {
            Object.assign(metadata, {
              artist: (metadata.artist && metadata.artist[0]) || '',
              title: metadata.title || '',
              album: metadata.album || '',
              track: (metadata.track && metadata.track.no) || '',
              disk: (metadata.disk && metadata.disk.no) || '',
              root: root,
              path: fileName,
              time: formatTime(fileStats.ctime),
              picture: metadata.picture[0] ? parsePicture(metadata.picture[0]) : null
            })
          }
          musicMetadata(readStream, (error, metadata) => {
            if (error) {
              console.error(fileName, error)
            } else {
              writeMeta(metadata)
              addTrack(database, metadata)
                .then(() => {
                  readStream.close()
                  setTimeout(() => {
                    next()
                  }, 100)
                })
            }
          })
        } catch (e) {
          console.error(e)
          next()
        }
      } else {
        next()
      }
    })
    directory.on('directory', async (root, dirStats, next) => {
      const folderName = path.join(root, `/${dirStats.name}`)
      if (scannedFolders.includes(folderName)) {
        next()
      } else {
        scannedFolders.push(folderName)
        try {
          const childTracks = await scanFolder(database, folderName, sender)
          childTracks.forEach(track => {
            tracks.push(track)
          })
          setTimeout(() => {
            next()
          }, 200)
        } catch (e) {
          console.log('error at ', folderName)
          reject(e)
        }
      }
    })
    directory.on('end', () => {
      resolve(tracks)
    })
  })
}

module.exports = scanFolder
