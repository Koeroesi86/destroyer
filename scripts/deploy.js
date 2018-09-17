const Client = require('ssh2-sftp-client')
const fs = require('fs')
const path = require('path')

let sftp = new Client()
const distPath = path.resolve(__dirname, '../dist')

const {
  SFTP_HOST,
  SFTP_PATH,
  SFTP_USER,
  SFTP_PASSWORD,
  TRAVIS_OS_NAME
} = process.env

const foundFiles = fs.readdirSync(distPath).reduce((prev, file) => {
  const filePath = path.join(distPath, file)
  const stats = fs.statSync(filePath)
  if (stats.isSymbolicLink()) return prev

  if (stats.isFile()) {
    console.log('Uploading', filePath)
    prev.push(filePath)
  }
  return prev
}, [])

sftp.connect({
  host: SFTP_HOST,
  port: '22',
  username: SFTP_USER,
  password: SFTP_PASSWORD
})
  .then(() => {
    const f = foundFiles.map(localFilePath => sftp.put(localFilePath, `${SFTP_PATH}/${TRAVIS_OS_NAME}`))
    return Promise.all(f)
  })
  .then(() => sftp.list(`${SFTP_PATH}/${TRAVIS_OS_NAME}`))
  .then((data) => console.log(data))
