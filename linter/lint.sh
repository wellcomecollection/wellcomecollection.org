#!/usr/bin/env bash

set -o errexit
set -o nounset

npx eslint -c ./.eslintrc.json ../server ../client --fix

JS_FILES=$(git diff --name-only --diff-filter=ACM | grep '\.js\?$' | tr '\n' ' ')
[ -z "$JS_FILES" ] && exit 0

# Add back the modified/prettified files to staging
echo "$JS_FILES" | xargs git add
git commit -am "Linting the JS"
git push

exit 0
