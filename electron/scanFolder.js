const musicMeta = require('music-metadata')
const path = require('path')
const { walk } = require('walk')
const dateFns = require('date-fns')
const fs = require('fs')
const crypto = require('crypto')
const addTrack = require('./addTrack')

const supportedFormats = ['flac', 'm4a', 'mp3', 'mp4', 'aac']

const folderDelay = 400
const fileDelay = 200
const fileReadTimeout = 5000

const parsePicture = picture => {
  const fileName = crypto.createHash('md5').update(picture.data.toString('base64')).digest('hex')
  const filePath = path.resolve(__dirname, `../albumart/${fileName}.${picture.format}`)
  fs.writeFileSync(
    filePath,
    picture.data
  )
  // return `data:image/${picture.format};base64, ${picture.data.toString('base64')}`
  return `file://${filePath}`
}
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
      const timer = setTimeout(() => {
        const err = new Error(`File access timeout ${fileName}`)
        reject(err.message)
        throw err
      }, fileReadTimeout)
      musicMeta.parseFile(fileName)
        .then((metadata) => {
          transformMeta(metadata)
          addTrack(database, metadata)
            .then(() => {
              clearTimeout(timer)
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

    const directory = walk(currentPath, { followLinks: false })
    directory.on('file', (fileRoot, fileStats, next) => {
      const fileName = path.join(fileRoot, '/' + fileStats.name)
      const extension = path.extname(fileName).replace('.', '')

      if (supportedFormats.includes(extension)) {
        sender.send('SCANNING_FILE', { fileName })
        writeMeta(fileName, fileStats, database)
          .then(() => {
            setTimeout(() => next(), fileDelay)
          })
          .catch(e => {
            console.error(fileName, e)
            setTimeout(() => next(), fileDelay)
          })
      }
    })
    directory.on('directory', async (dirRoot, dirStats, next) => {
      const folderName = path.join(dirRoot, `/${dirStats.name}`)
      if (scannedFolders.includes(folderName)) {
        next()
      } else {
        scanFolder(database, folderName, sender)
          .then(() => {
            setTimeout(() => next(), folderDelay)
          })
          .catch(e => {
            console.error('error at folder', folderName)
            reject(e)
            throw new Error(`error at folder${folderName}`)
          })
      }
    })
    directory.on('end', () => {
      resolve()
    })
  })
}

module.exports = scanFolder
