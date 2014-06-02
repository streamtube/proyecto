#!/bin/bash

if [ "$(whoami)" != "root" ]; then
    echo "Necesitas ser administrador antes de ejecutar este script!"
    echo "Ejecuta: 'sudo ./install.sh'"
    exit
fi


# return 1 if global command line program installed, else 0
# example
# echo "node: $(program_is_installed node)"
function program_is_installed {
    # set to 1 initially
    local return_=1
    # set to 0 if not found
    type $1 >/dev/null 2>&1 || { local return_=0; }
    # return value
    echo "$return_"
}

# return 1 if local npm package is installed at ./node_modules, else 0
# example
# echo "gruntacular : $(npm_package_is_installed gruntacular)"
function npm_package_is_installed {
    # set to 1 initially
    local return_=1
    # set to 0 if not found
    if [ ! -d "node_modules" ]; then
        { local return_=0; }
    else
        if [ ! -d "node_modules/$1" ]; then
            { local return_=0; }
        fi
    fi

    ls node_modules | grep $1 >/dev/null 2>&1 || { local return_=0; }
    # return value
    echo "$return_"
}

# display a message in red with a cross by it
# example
# echo echo_fail "No"
function echo_fail {
    # echo first argument in red
    printf "\e[31m✘ ${1}"
    # reset colours back to normal
    echo -e "\e[0;37m"
}

# display a message in green with a tick by it
# example
# echo echo_fail "Yes"
function echo_pass {
    # echo first argument in green
    printf "\e[32m✔ ${1}"
    # reset colours back to normal
    echo -e "\e[0;37m"
}

# echo pass or fail
# example
# echo echo_if 1 "Passed"
# echo echo_if 0 "Failed"
function echo_if {
    if [ $1 == 1 ]; then
    echo_pass $2
    else
    echo_fail $2
    fi
}

function comprobar_apps {
    echo "------------------------------------------------"
    echo "  git $(echo_if $(program_is_installed git))"
    echo "  php $(echo_if $(program_is_installed php))"
    echo "  mysql $(echo_if $(program_is_installed mysql))"
    echo "  java $(echo_if $(program_is_installed java))"
    echo "  phpstorm $(echo_if $(program_is_installed phpstorm))"
    echo "  node $(echo_if $(program_is_installed node))"

    # local npm packages
    echo "      socket.io $(echo_if $(npm_package_is_installed socket.io))"
    echo "------------------------------------------------"
    sleep 1
}

echo -e "\nComprobando aplicaciones instaladas..."
comprobar_apps


if [ $(program_is_installed git) == 1 ]; then
    echo ""
else
    echo "1. Instalando git: sudo apt-get install git"
    sudo apt-get install git
    git config --global color.ui true
    comprobar_apps
fi
echo "2. Comprobando repositorio del proyecto: cd /var/www/proyecto "
cd /var/www/
if [ ! -d "proyecto" ]; then
    echo "El repositorio del proyecto no está clonado"
    git clone https://github.com/streamtube/proyecto.git
    cd proyecto/

    read -p "¿Cúal es tu nombre de usuario en github? Si no te acuerdas no pongas nada: " username;
    if [ ! -z "$username" -a "$username" != " " ]; then
        git config --global user.name ${username};
        git config remote.origin.url https://${username}@github.com/streamtube/proyecto.git
    else
        echo "Cuando te acuerdes ejecuta git config --global user.name tuNombreDeUsuario";
    fi

    read -p "¿Cúal es tu email en github? Si no te acuerdas no pongas nada: " email;
    if [ ! -z "$email" -a "$email" != " " ]; then
        git config --global user.email ${email};
    else
        echo "Cuando te acuerdes ejecuta git config --global user.email tuEmail";
    fi
else
    echo "Correcto."
fi

chown -R $SUDO_USER:$SUDO_USER /var/www/proyecto/

cd /var/www/proyecto

if [ $(program_is_installed php) == 1 -a $(program_is_installed mysql) == 1 ]; then
    echo ""
else
    echo "3. Instalando Apache, Mysql y PHP"
    sudo apt-get install apache2 mysql-server mysql-client apache2 php5 libapache2-mod-php5 php5-mysql php5-curl
    comprobar_apps
fi

if [ $(program_is_installed java) == 1 ]; then
    echo ""
else
    echo "4. Instalando Java (para el phpstorm)"
    sudo add-apt-repository ppa:webupd8team/java
    sudo apt-get update
    sudo apt-get install oracle-java8-installer
    comprobar_apps
fi

if [ $(program_is_installed phpstorm) == 1 ]; then
    echo ""
else
    echo "4. Instalando Phpstorm"
    USER_HOME=$(getent passwd $SUDO_USER | cut -d: -f6)
    cd ${USER_HOME}
    wget http://download.jetbrains.com/webide/PhpStorm-7.1.3.tar.gz -O PhpStorm.tar.gz

    # get directory to which will be PhpStorm extracted
    PHPSTORM_DIR=`tar -ztf PhpStorm.tar.gz | grep "bin/phpstorm.sh" | tail -n 1 | awk -F "/" '{print $1}'`

    # unpack and remove archive
    tar -zxvf PhpStorm.tar.gz
    rm PhpStorm.tar.gz

    # change name to phpstorm
    mv ${PHPSTORM_DIR} phpstorm

    # create softlink
    ln -s ${USER_HOME}/phpstorm/bin/phpstorm.sh /usr/bin/phpstorm
    # change folder owner to normal user not root
    chown -R ${SUDO_USER}:${SUDO_USER} phpstorm/

    echo -e "\nDone Phpstorm."
    comprobar_apps
fi

if [ $(program_is_installed node) == 1 ]; then
    echo ""
else
    echo "5. Instalando Node.js"
    sudo apt-get install g++
    mkdir /tmp/node-install
    cd /tmp/node-install
    wget http://nodejs.org/dist/v0.10.21/node-v0.10.21.tar.gz -O node.tar.gz

    NODE_DIR=`tar -ztf node.tar.gz | grep "Makefile" | tail -n 1 | awk -F "/" '{print $1}'`

    tar -zxf node.tar.gz
    echo 'Node.js download & unpack completed'

    # Install Node.js
    echo 'Install Node.js'
    cd ${NODE_DIR}
    ./configure && make && make install
    echo 'Node.js install completed'
    comprobar_apps
fi

cd /var/www/proyecto

if [ $(npm_package_is_installed socket.io) == 1 ]; then
    echo ""
else
    echo "5. Instalando socket.io"
    npm install socket.io
    comprobar_apps
fi

echo -e "Finalizando\n"
