#!/usr/bin/env bash

cd dist
echo uploading to sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}
curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} -T ./latest.yml sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}
echo "Uploaded latest.yml"
find ./ -name 'eMusic Setup*.exe' -type f -exec curl -u ${SFTP_USER}:${SFTP_PASSWORD} -T {} sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME} \;
echo "Uploaded package"
