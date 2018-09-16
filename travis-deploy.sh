#!/usr/bin/env bash

cd dist
echo uploading to sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}
curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail --upload-file ./latest.yml sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/latest.yml
echo "Uploaded latest.yml"
find ./ -name 'eMusic Setup*.exe' -type f -exec curl -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail --upload-file {} sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/{} \;
echo "Uploaded package"
