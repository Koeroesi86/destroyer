#!/usr/bin/env bash

cd dist
echo uploading to sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}
find ./ -name 'eMusic Setup*' -type f -exec curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail -F "$1" "sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/$1" - {} \; -exec echo $1 - {} \;
echo "Uploaded package"
curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail -F ./latest.yml sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/latest.yml
echo "Uploaded latest.yml"
