#!/bin/bash

sudo su

sudo apt-get install git

cd /var/www/

echo "Usuario y password de github...";
git clone https://github.com/streamtube/proyecto.git

git status

git pull

sudo apt-get install apache2 mysql-server mysql-client apache2 php5 libapache2-mod-php5 php5-mysql php5-curl

sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java7-installer

PHPSTORM_HOME="$HOME/phpstorm"
DESKTOP_ENTRY_FILE_NAME="PhpStorm.desktop"

mkdir -p $PHPSTORM_HOME
cd $PHPSTORM_HOME

wget http://download.jetbrains.com/webide/PhpStorm-7.0.tar.gz -O PhpStorm.tar.gz

# get directory to which will be PhpStorm extracted
PHPSTORM_DIR=`tar -ztf PhpStorm.tar.gz | grep "bin/phpstorm.sh" | tail -n 1 | awk -F "/" '{print $1}'`

# unpack and remove archive
tar -zxvf PhpStorm.tar.gz
rm PhpStorm.tar.gz

echo -e "Done Phpstorm."

ln -s /usr/bin/phpstorm ~/$PHPSTORM_DIR/bin/phpstorm.sh

mkdir /tmp/node-install
cd /tmp/node-install
wget http://nodejs.org/dist/v0.10.21/node-v0.10.21.tar.gz -O node.tar.gz

NODE_DIR=`tar -ztf node.tar.gz | grep "Makefile" | tail -n 1 | awk -F "/" '{print $1}'`

tar -zxf node.tar.gz
echo 'Node.js download & unpack completed'

# Install Node.js
echo 'Install Node.js'
cd $NODE_DIR
./configure && make && make install
echo 'Node.js install completed'

cd /var/www/proyecto/

firefox http://localhost/proyecto/WEBRTC.html



