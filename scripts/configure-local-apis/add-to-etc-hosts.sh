#!/usr/bin/env bash

set -e

# colours
YELLOW='\033[1;33m'
NC='\033[0m' # no colour - reset console colour

if [[ $# -lt 1 ]]
then
  echo "add-to-hosts-file <DOMAIN>"
  echo "Add an entry to hosts file to resolve to 127.0.0.1"
	echo "Example: add-to-hosts-file foo.local"
	exit 1
fi

DOMAIN=$1

if grep '127.0.0.1' /etc/hosts | grep ${DOMAIN} ; then
  echo -e "✅ /etc/hosts entry already exists for ${DOMAIN}"
else
  echo -e "🔧 ${YELLOW}adding /etc/hosts entry for ${DOMAIN}. Requires sudo - enter password when prompted.${NC}"
  sudo sh -c "echo '127.0.0.1		${DOMAIN}' >> /etc/hosts"
fi