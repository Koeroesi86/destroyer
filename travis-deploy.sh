#!/usr/bin/env bash

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
    brew update;
    brew install curl;
    brew link curl --force;
fi
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
    apt-get update;
    apt-get install -y curl;
fi

cd dist
ls -la
echo uploading to sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}
find ./ -name 'eMusic-*' -type f -exec curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail -T {} sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/{} \; -exec echo {} \;
echo "Uploaded package"
find ./ -name 'latest*.yml' -type f -exec curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail -T {} sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/{} \; -exec echo {} \;
#curl -k -u ${SFTP_USER}:${SFTP_PASSWORD} --verbose --fail -T ./latest-mac.yml sftp://${SFTP_HOST}${SFTP_PATH}/${TRAVIS_OS_NAME}/latest-mac.yml
#echo "Uploaded latest-mac.yml"
