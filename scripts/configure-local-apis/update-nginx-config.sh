#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# colours
YELLOW='\033[1;33m'
NC='\033[0m' # no colour - reset console colour

NGINX_HOME=$("${DIR}/locate-nginx.sh")

# Ports used by local API services (see weco-local.conf)
USED_PORTS=(8080 8081 3000 3001 3002 3003)

# Check nginx config files for port conflicts with our local API services
check_port_conflicts() {
  local file="$1"
  local has_conflict=false
  for port in "${USED_PORTS[@]}"; do
    if grep -qE '^\s*listen\s+.*\b'"$port"'\s*;' "$file"; then
      if [ "$has_conflict" = false ]; then
        echo ""
        echo -e "${YELLOW}⚠️  Port conflict detected in ${file}:${NC}"
        has_conflict=true
      fi
      echo -e "${YELLOW}   - A server block is listening on port ${port}, which is needed by a local API service.${NC}"
    fi
  done
  if [ "$has_conflict" = true ]; then
    echo ""
    echo -e "${YELLOW}   Please comment out or remove the conflicting server block(s) in:${NC}"
    echo -e "${YELLOW}   ${file}${NC}"
    echo -e "${YELLOW}   Then restart nginx for the changes to take effect.${NC}"
    echo ""
  fi
}

# Check main nginx.conf
if [ -f "$NGINX_HOME/nginx.conf" ]; then
  check_port_conflicts "$NGINX_HOME/nginx.conf"
fi

# Check other configs in servers/ (excluding our own weco-local.conf)
if [ -d "$NGINX_HOME/servers" ]; then
  for conf in "$NGINX_HOME/servers/"*.conf; do
    [ -f "$conf" ] || continue
    [ "$(basename "$conf")" = "weco-local.conf" ] && continue
    check_port_conflicts "$conf"
  done
fi

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