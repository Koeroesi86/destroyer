
const express = require('express')
const { resolve, extname, basename } = require('path')
const fs = require('fs')
const url = require('url')
const mmmagic = require('mmmagic')
const sharp = require('sharp')

const server = express()
const mimeType = new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE)

function setupServer () {
  server.use('/app', express.static(resolve(__dirname, '../build')))
  server.get('/local', (request, response) => {
    const urlParts = url.parse(request.url, true)
    const query = urlParts.query

    if (query.path) {
      const sendFile = (path) => {
        mimeType.detectFile(path, function (err, result) {
          if (err) {
            response.status(500).send(err)
            return
          }
          response.setHeader('Access-Control-Allow-Origin', '*')
          response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
          response.setHeader('Content-Type', result)
          fs.createReadStream(path).pipe(response)
        })
      }

      if (query.optimized) {
        const basename = basename(query.path, extname(query.path))
        const notificationImage = resolve(global.appDataPath, `./albumart/${basename}-optimized.png`)
        if (fs.existsSync(notificationImage)) {
          sendFile(notificationImage)
        } else {
          sharp(resolve(query.path))
            .resize(250, 250)
            .max()
            .png({ compressionLevel: 9, force: true })
            .toFile(notificationImage)
            .then(info => {
              sendFile(notificationImage)
            })
        }
      } else {
        sendFile(query.path)
      }
    } else {
      response.status(404)
    }
  })

  server.listen(global.port, () => {
    console.log(`Example app listening on port ${global.port}!`)
  })
}

module.exports = setupServer
