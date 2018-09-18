#!/usr/bin/env bash

cd dist
ls -la
#echo uploading to sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}
#find ./ -name 'eMusic-*' -type f -exec curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail -T {} sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/{} \; -exec echo {} \;
rsync -ue "ssh" ./eMusic-* ${SFTP_USER}@${SFTP_HOST}:${SFTP_PATH}/${TRAVIS_OS_NAME}/
echo "Uploaded package"
#find ./ -name 'latest*.yml' -type f -exec curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail -T {} sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/{} \; -exec echo {} \;
#curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail -T ./latest-mac.yml sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/latest-mac.yml
#echo "Uploaded latest-mac.yml"
