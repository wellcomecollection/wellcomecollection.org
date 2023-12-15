#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=${DIR}/..

setup_node_env() {
  echo "Attempting to switch node versions for you..."
  if command -v fnm &> /dev/null
  then
      fnm use
  else
    if command -v nvm &> /dev/null
    then
      echo "You are using 'nvm', 'fnm' is preferred (it's quicker)!"
      nvm use
    else
      echo "Please install fnm: 'brew install fnm'"
      exit 1
    fi
  fi
}

check_node_version() {
  runningNodeVersion=$(node -v)
  requiredNodeVersion=$(cat "$ROOT_DIR/.nvmrc")

  # remove leading v
  runningNodeVersionNumber=${runningNodeVersion//[v]/}

  if [ "$runningNodeVersionNumber" != "$requiredNodeVersion" ]; then
    echo -e "Using wrong version of Node. Required ${requiredNodeVersion}. Running ${runningNodeVersion}."
    setup_node_env
  fi
}

install_node_deps() {
  echo "Installing node dependencies"
  if command -v yarn &> /dev/null
  then
    yarn install
  else
    echo "yarn not found, installing..."
    npm install --global yarn
    yarn install
  fi
}

print_instructions() {
  cat <<- "EOF"
------------------------
You're all set up :)

To run a project, from the root directory:

# yarn {appName = content|identity}
# e.g.
> yarn content

# you may also run all of them concurrently.
# this may add a prefix to the URL such as `/catalogue/`
# and is only for local cross projects development
> yarn run-concurrently

EOF
}

check_node_version
install_node_deps
print_instructions