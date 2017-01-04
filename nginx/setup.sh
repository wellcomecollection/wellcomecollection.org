#!/usr/bin/env bash

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'
# TODO: Get this from `nginx -V`
URI=next.dev-wellcomecollection.org
NGINX_CONF_PATH=/usr/local/etc/nginx/
PEM_PATH=certs/${URI}.pem
KEY_PATH=certs/${URI}.key
CURRENT_PATH=$(pwd)/


openssl req -x509 -sha256 -newkey rsa:2048 \
            -keyout ./${KEY_PATH} \
            -out ./${PEM_PATH} \
            -days 1024 -nodes -subj "/CN=${URI}"

# I don't do the whole directory incase we need to add others for other projects
mkdir -p ${CURRENT_PATH}certs
mkdir -p ${NGINX_CONF_PATH}certs
mkdir -p ${NGINX_CONF_PATH}sites-enabled

cp ${CURRENT_PATH}${KEY_PATH} ${NGINX_CONF_PATH}${KEY_PATH}
cp ${CURRENT_PATH}${PEM_PATH} ${NGINX_CONF_PATH}${PEM_PATH}
cp ${CURRENT_PATH}${URI}.conf ${NGINX_CONF_PATH}sites-enabled/${URI}.conf

echo "\n${CYAN}We need sudo to add the cert to your keychain${NC}"
sudo security delete-certificate -c ${URI} > /dev/null 2>&1
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain \
${NGINX_CONF_PATH}${PEM_PATH}

echo "\n${CYAN}We also need sudo to bind to port 443 - sorry${NC}"
sudo nginx -s stop
sudo nginx

# We issue this as an instruction so we don't keep appending the line
echo "\n${CYAN}You can add this to your hosts file if you haven't already by running:${NC}"
echo "${PURPLE}echo \"127.0.0.1 ${URI}\" >> /etc/hosts${NC}"


echo "${GREEN}All Done${NC}"
