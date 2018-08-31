const musicMeta = require('music-metadata')
const path = require('path')
const { walk } = require('walk')
const fs = require('fs')
const _ = require('lodash')
const crypto = require('crypto')
const slugify = require('slugify')
const addTrack = require('./addTrack')
const executeQuery = require('./executeQuery')

const supportedFormats = [
  'ape',
  'aif', 'aiff', 'aifc',
  'asf', 'wma', 'wmv',
  'flac',
  'm4a', 'm4b', 'm4p', 'm4v', 'm4r', '3gp', 'mp4', 'aac',
  'mp2', 'mp3', 'm2a',
  'ogv', 'oga', 'ogx', 'ogg', 'opus',
  'wav',
  'wv', 'wvp'
]

const folderDelay = 200 // delay after a folder scan
const fileDelay = 100 // delay after a file scan
const fileReadTimeout = 2000
const breakLimit = 1000 // take a break after this amount of scanned files
const breakMultiplier = 100 // multiply the default file delay on a break
/** @var {Array} existingTracks */
let existingTracks
const scannedFolders = []
let counter = 0
let progress = 0
let totalCount = 0

const normalizePath = path => (path || '').replace(/\\/g, '/')

const transformMeta = ({ common: metadata, format }, fileName, appDataPath) => Promise.resolve(
  Object.assign({}, {
    path: normalizePath(fileName),
    artist: metadata.artist || '',
    album: metadata.album ? `${metadata.album}` : '',
    title: metadata.title || '',
    year: metadata.year || '',
    track: (metadata.track && metadata.track.no) || '',
    disk: (metadata.disk && metadata.disk.no) || '',
    genre: (metadata.genre && metadata.genre[0]) || '',
    picture: (metadata.picture && metadata.picture[0]) ? parsePicture(metadata.picture[0], (metadata.album || ''), appDataPath) : null,
    duration: format.duration
  })
)

// const stringify = obj => JSON.stringify(obj, obj ? Object.keys(obj).sort() : () => {})
// const isEqual = (a, b) => stringify(a) === stringify(b)
const isEqual = (a, b) => _.isEqualWith(a, b, (one, two) => `${one}` === `${two}`)

/**
 * @param {String} album
 * @param {Object} picture
 * @property {String} picture.format
 * @property {Buffer} picture.data
 * @param {String} appDataPath
 * @return {String|null}
 */
const parsePicture = (picture, album, appDataPath) => {
  const folderPath = path.resolve(appDataPath, `./albumart/`)
  const fileHash = crypto.createHash('md5').update(picture.data.toString('base64')).digest('hex')
  const slug = slugify(album, { remove: /[*+~./()'",!:@\\]/g, lower: true })
  const fileName = `${slug}-${fileHash}`
  let extension = picture.format.replace(/^image\//, '')
  switch (extension) {
    case 'jpeg':
      extension = 'jpg'
      break
  }
  const filePath = path.resolve(folderPath, `./${fileName}.${extension}`)

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }

  if (extension === '' || !extension) {
    return null
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, picture.data)
  }

  return normalizePath(filePath)
}

const writeMeta = (fileName, fileStats, database, appDataPath) => {
  return new Promise((resolve, reject) => {
    try {
      const timer = setTimeout(() => {
        const err = new Error(`File access timeout ${fileName}`)
        reject(err)
        throw err
      }, fileReadTimeout)
      musicMeta.parseFile(fileName)
        .then(m => m)
        .then(metadata => transformMeta(metadata, fileName, appDataPath))
        .then(meta => {
          const existingTrack = existingTracks.find(track => track.path === meta.path)
          if (isEqual(existingTrack, meta)) {
            return Promise.resolve()
          } else {
            return addTrack(database, meta)
          }
        })
        .then(() => {
          clearTimeout(timer)
          resolve()
        })
        .catch(err => {
          console.error(err.message)
          clearTimeout(timer)
          reject(err)
        })
    } catch (e) {
      reject(e)
    }
  })
}

const countFilesSync = (directory, fileCount = 0) => {
  return fs.readdirSync(directory).reduce((prev, file) => {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)
    if (stats.isSymbolicLink()) return prev

    return prev + (stats.isDirectory() ? countFilesSync(filePath) : 1)
  }, fileCount)
}

/** Scan a defined folder for tracks
 * @param {Object} database
 * @param {String} currentPath
 * @param {Object} sender
 * @param {String} appDataPath
 * @returns {Promise}
 * */
function scanFolder (database, currentPath, sender, appDataPath) {
  return new Promise((resolve, reject) => {
    sender.send('SCANNING_FOLDER', { folder: currentPath })
    scannedFolders.push(currentPath)

    if (!totalCount) {
      totalCount = countFilesSync(currentPath)
    }

    function scan () {
      const directory = walk(currentPath, { followLinks: false })
      directory.on('file', (fileRoot, fileStats, next) => {
        const fileName = path.join(fileRoot, '/' + fileStats.name)
        const extension = path.extname(fileName).replace('.', '')

        const nextFile = () => {
          counter += 1
          progress += 1
          let delay = fileDelay
          if (counter >= breakLimit) {
            delay = fileDelay * breakMultiplier
            console.log(`Taking a ${delay / 1000} second break...`)
          }
          setTimeout(() => {
            if (counter >= breakLimit) {
              console.log('I am back!')
              counter = 0
            }
            next()
          }, delay)
        }
        if (supportedFormats.includes(extension)) {
          sender.send('SCANNING_FILE', { fileName, progress, totalCount })
          if (progress === totalCount) {
            setTimeout(() => {
              progress = 0
              totalCount = 0
            }, 1)
          }
          writeMeta(fileName, fileStats, database, appDataPath)
            .then(nextFile)
            .catch(e => {
              console.error(fileName, e)
              nextFile()
            })
        } else {
          nextFile()
        }
      })
      directory.on('directory', (dirRoot, dirStats, next) => {
        const folderName = path.join(dirRoot, `/${dirStats.name}`)
        if (scannedFolders.includes(folderName)) {
          next()
        } else {
          scanFolder(database, folderName, sender, appDataPath)
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
      directory.on('errors', (root, nodeStatsArray, next) => {
        console.error('errors detected', nodeStatsArray)
        next()
      })
      directory.on('end', () => {
        resolve()
      })
    }

    if (existingTracks) {
      scan()
    } else {
      executeQuery(database, {
        query: `SELECT * FROM library ORDER BY path ASC`,
        variables: []
      }).then(t => {
        existingTracks = t
        scan()
      })
    }
  })
}

module.exports = scanFolder
