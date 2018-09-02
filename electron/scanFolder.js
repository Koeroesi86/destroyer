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
const scannedFiles = []
const foundFiles = []
let counter = 0
let progress = 0
let totalCount = 0
let appDataPath
let database
let prevFolder

const normalizePath = path => (path || '').replace(/\\/g, '/')

const transformMeta = ({ common: metadata, format }, fileName) => Promise.resolve(
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

const isEqual = (a, b) =>
  Object.getOwnPropertyNames(a)
    .map(key => `${a[key]}` === `${b[key]}`)
    .reduce((prev, current) => prev && current, true)

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

  return path.basename(filePath)
}

const writeMeta = (fileName) => {
  return new Promise((resolve, reject) => {
    let cancelled = false
    const timer = setTimeout(() => {
      const err = new Error(`File access timeout ${fileName}`)
      reject(err)
      cancelled = err
    }, fileReadTimeout)
    musicMeta.parseFile(fileName)
      .then(m => m)
      .then(metadata => transformMeta(metadata, fileName))
      .then(meta => {
        if (cancelled) {
          return Promise.reject(cancelled)
        } else {
          const existingTrack = existingTracks.find(track => track.path === meta.path)
          if (isEqual(existingTrack, meta)) {
            return Promise.resolve()
          } else {
            return addTrack(database, meta)
          }
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
  })
}

const countFilesSync = (directory, fileCount = 0) => {
  return fs.readdirSync(directory).reduce((prev, file) => {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)
    if (stats.isSymbolicLink()) return prev

    if (stats.isDirectory()) {
      return prev + countFilesSync(filePath)
    } else {
      foundFiles.push(filePath)
      return prev + 1
    }
  }, fileCount)
}

const init = (currentPath) => {
  if (existingTracks) {
    return Promise.resolve()
  } else {
    appDataPath = global._appDataPath
    database = global._database
    prevFolder = currentPath
    totalCount = countFilesSync(currentPath)
    foundFiles.sort()
    return executeQuery(database, {
      query: `SELECT * FROM library ORDER BY path ASC`,
      variables: []
    }).then(t => {
      existingTracks = t
      return Promise.resolve()
    })
  }
}

const end = () => {
  progress = 0
  totalCount = 0
  existingTracks = null
  scannedFolders.splice(0)
  scannedFiles.splice(0)
  foundFiles.splice(0)
  return Promise.resolve()
}

const nextFile = (next) => {
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

const stepFile = (fileName, sender) => new Promise(resolve => {
  const extension = path.extname(fileName).replace('.', '')
  const scanned = scannedFiles.includes(fileName)
  const fileStats = fs.statSync(fileName)
  const folder = path.dirname(fileName)

  if (folder !== prevFolder) {
    sender.send('SCANNING_FOLDER', { folder })
    prevFolder = folder
  }

  if (supportedFormats.includes(extension) && !scanned && fileStats.isFile()) {
    scannedFiles.push(fileName)
    sender.send('SCANNING_FILE', { fileName, progress, totalCount })
    writeMeta(fileName)
      .then(() => nextFile(resolve))
      .catch(e => {
        console.error(fileName, e)
        nextFile(resolve)
      })
  } else if (scanned || !fileStats.isFile()) {
    // don't count the risky ones
    if (!fileStats.isFile()) console.log('meh?', fileName, fileStats)
    if (scanned) console.log('double scanned', fileName)
    resolve()
  } else {
    nextFile(resolve)
  }
})

const scan = (sender) => new Promise(resolve => {
  foundFiles.reduce((p, filePath) => {
    return p.then(() => stepFile(filePath, sender))
  }, Promise.resolve()).then(resolve)
})

/** Scan a defined folder for tracks
 * @param {String} path
 * @param {Object} sender
 * @returns {Promise}
 * */
const scanFolder = (path, sender) =>
  new Promise((resolve, reject) => {
    init(path)
      .then(() => scan(sender))
      .then(() => {
        end()
        console.log(foundFiles.length)
        console.log(totalCount)
        console.log(database)
        resolve()
      })
      .catch(err => {
        end()
        reject(err)
      })
  })

module.exports = scanFolder
