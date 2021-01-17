#!/bin/bash
apt-get update -y
curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs
npm install -g forever
npm install pm2 -g
rm -rf /nodeapp
mkdir /nodeapp
