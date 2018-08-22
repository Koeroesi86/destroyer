const musicMeta = require('music-metadata')
const fs = require('fs')
const path = require('path')
const dateFns = require('date-fns')
const addTrack = require('./addTrack')

const supportedFormats = ['flac', 'm4a', 'mp3', 'mp4', 'aac']

const parsePicture = picture => `data:image/${picture.format};base64, ${picture.data.toString('base64')}`
const formatTime = time => Number(dateFns.format(new Date(time), 'YYYYMMDDmm')) * -1
const scannedFolders = []

const writeMeta = (fileName, fileStats, database) => {
  return new Promise((resolve, reject) => {
    try {
      const transformMeta = metadata => {
        Object.assign(metadata, {
          artist: (metadata.artist && metadata.artist[0]) || '',
          title: metadata.title || '',
          album: metadata.album || '',
          track: (metadata.track && metadata.track.no) || '',
          disk: (metadata.disk && metadata.disk.no) || '',
          genre: (metadata.genre && metadata.genre[0]) || '',
          root: path.dirname(fileName),
          path: fileName,
          time: formatTime(fileStats.ctime),
          picture: (metadata.picture && metadata.picture[0]) ? parsePicture(metadata.picture[0]) : null
        })
      }
      musicMeta.parseFile(fileName)
        .then((metadata) => {
          transformMeta(metadata)
          addTrack(database, metadata)
            .then(() => {
              resolve()
            })
        })
        .catch(err => {
          console.error(err.message)
          reject(err.message)
        })
    } catch (e) {
      reject(e)
    }
  })
}

/** Scan a defined folder for tracks
 * @param database
 * @param currentPath
 * @param sender
 * @returns {Promise}
 * */
function scanFolder (database, currentPath, sender) {
  return new Promise((resolve, reject) => {
    sender.send('SCANNING_FOLDER', { folder: currentPath })
    scannedFolders.push(currentPath)

    const files = fs.readdirSync(currentPath).map(file => path.join(currentPath, '/' + file))
    // console.log(currentPath)
    // console.log(files)
    files.forEach((filePath, index) => {
      const stats = fs.statSync(filePath)
      if (stats.isDirectory()) {
        if (!scannedFolders.includes(filePath)) {
          scanFolder(database, filePath, sender)
            .then(() => {
              if (index === files.length - 1) resolve()
            })
            .catch(e => {
              console.error('error at folder', filePath)
              reject(e)
              throw new Error(`error at folder${filePath}`)
            })
        }
      } else {
        const extension = path.extname(filePath).replace('.', '')

        if (supportedFormats.includes(extension)) {
          sender.send('SCANNING_FILE', { filePath })
          writeMeta(filePath, stats, database)
            .then(() => {
              if (index === files.length - 1) resolve()
            })
            .catch(e => {
              console.error(filePath, e)
              if (index === files.length - 1) resolve()
            })
        }
      }
    })
  })
}

module.exports = scanFolder
