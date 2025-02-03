#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# colours
YELLOW='\033[1;33m'
NC='\033[0m' # no colour - reset console colour

NGINX_HOME=$("${DIR}/locate-nginx.sh")

# ensure $NGINX_HOME/servers exists
mkdir -p $NGINX_HOME/servers

# check if $NGINX_HOME/servers/weco-local.conf exists and has the same contents as $DIR/weco-local.conf
if [ -f $NGINX_HOME/servers/weco-local.conf ]; then
  if cmp -s $DIR/weco-local.conf $NGINX_HOME/servers/weco-local.conf; then
    echo -e "✅ ${NGINX_HOME}/servers/weco-local.conf is up to date"
    exit 0
  else
    echo -e "🔧 ${YELLOW}updating ${NGINX_HOME}/servers/weco-local.conf${NC}"
  fi
else
  echo -e "🔧 ${YELLOW}creating ${NGINX_HOME}/servers/weco-local.conf${NC}"
fi

cp $DIR/weco-local.conf $NGINX_HOME/servers/