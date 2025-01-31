#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPTS_DIR=${DIR}/configure-local-running

# colours
YELLOW='\033[1;33m'
MAGENTA='\033[1;35m'
GREEN='\033[1;32m'
NC='\033[0m' # no colour - reset console colour

setup_deps() {( set -e
  echo -e "${MAGENTA}Setting up OSX dependencies ...${NC}"
  if ! command -v brew &> /dev/null
  then
    echo "Please install brew.sh: https://brew.sh/"
    exit 1
  fi
  brew install mkcert nginx
)}

install_certs() {( set -e
  echo -e "${MAGENTA}Setting up local certificates for wellcomecollection.org${NC} ..."
  $SCRIPTS_DIR/setup-mkcert.sh www-dev.wellcomecollection.org
  $SCRIPTS_DIR/setup-mkcert.sh api-dev.wellcomecollection.org
)}

add_to_etc_hosts() {( set -e
  echo -e "${MAGENTA}Adding entries to /etc/hosts ...${NC}"
  $SCRIPTS_DIR/add-to-etc-hosts.sh www-dev.wellcomecollection.org
  $SCRIPTS_DIR/add-to-etc-hosts.sh api-dev.wellcomecollection.org
)}

configure_nginx() {( set -e
  echo -e "${MAGENTA}Configuring nginx ...${NC}"
  $SCRIPTS_DIR/update-nginx-config.sh
)}

setup_deps
install_certs
add_to_etc_hosts
configure_nginx

# echo sparkles then "All done! in green

echo -e "\n${GREEN} ✨ All done!${NC}"
echo -e "\n${YELLOW}Please restart nginx: \"sudo bash -c 'nginx -s stop && nginx'\"${NC}"