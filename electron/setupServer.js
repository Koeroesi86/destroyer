
const express = require('express')
const path = require('path')
const fs = require('fs')
const url = require('url')
const mmmagic = require('mmmagic')
const sharp = require('sharp')

const server = express()
const mimeType = new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE)

const sendFile = (path, response) => {
  mimeType.detectFile(path, (err, mime) => {
    if (err) {
      response.status(500).send(err)
      return
    }
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    response.setHeader('Content-Type', mime)
    if (/^image\//.test(mime)) {
      response.setHeader('Cache-Control', 'Public')
    }
    fs.createReadStream(path).pipe(response)
  })
}

function setupServer () {
  server.use('/app', express.static(path.resolve(__dirname, '../build')))
  server.use('/albumart/:albumArt', (request, response) => {
    const { albumArt } = request.params
    const basename = path.basename(albumArt)
    const current = path.join(global._appDataPath, './albumart/', basename)
    if (fs.existsSync(current)) {
      sendFile(current, response)
    } else if (/-optimized/.test(basename)) {
      const fileName = basename.replace(/-optimized/, '').replace(path.extname(basename), '')
      const suspectedFile = fs
        .readdirSync(path.resolve(global._appDataPath, './albumart'))
        .find(file => file.indexOf(fileName) === 0)

      if (suspectedFile) {
        const toOptimize = path.join(global._appDataPath, './albumart/', suspectedFile)
        sharp(toOptimize)
          .resize(250, 250)
          .max()
          .png({ compressionLevel: 9, force: true })
          .toFile(current)
          .then(info => {
            sendFile(current, response)
          })
          .catch(err =>
            response.status(500).send(`
              Can't generate optimized file from ${current}
              ${err}
            `)
          )
      }
    } else {
      response.send(404)
    }
  })

  server.get('/local', (request, response) => {
    const urlParts = url.parse(request.url, true)
    const query = urlParts.query

    if (query.path) {
      if (query.optimized) {
        const basename = path.basename(query.path, path.extname(query.path))
        const notificationImage = path.resolve(global._appDataPath, `./albumart/${basename}-optimized.png`)
        if (fs.existsSync(notificationImage)) {
          sendFile(notificationImage, response)
        } else {
          sharp(path.resolve(query.path))
            .resize(250, 250)
            .max()
            .png({ compressionLevel: 9, force: true })
            .toFile(notificationImage)
            .then(info => {
              sendFile(notificationImage, response)
            })
        }
      } else {
        sendFile(query.path, response)
      }
    } else {
      response.status(404)
    }
  })

  server.listen(global._port, () => {
    console.log(`Example app listening on port ${global._port}!`)
  })
}

module.exports = setupServer
